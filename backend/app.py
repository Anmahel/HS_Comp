import os
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from config import Config
from models import db, Brand, Cor, Design, SKU, Tamanho, Tipo, Estampa, PecaPronta

def parse_codigo_estampa_int(val):
    if val is None:
        return 0
    if isinstance(val, int):
        return val
    val_str = str(val).strip()
    match = re.search(r'\d+', val_str)
    if match:
        return int(match.group(0))
    return 0

def resolve_brand_id(data):
    brand_id = data.get("brand_id")
    if brand_id is not None:
        try:
            bid = int(brand_id)
            b = db.session.get(Brand, bid)
            if b:
                return b.id
            return None
        except (ValueError, TypeError):
            return None
    brand_slug = data.get("brand_slug") or data.get("brand_name") or data.get("brand")
    if brand_slug:
        b = Brand.query.filter((Brand.slug == str(brand_slug).strip()) | (Brand.name.ilike(f"%{brand_slug}%"))).first()
        if b:
            return b.id
        return None
    b = Brand.query.first()
    return b.id if b else None

def resolve_sku_id(data, auto_sku_str=None):
    sku_id = data.get("sku_id")
    if sku_id is not None:
        try:
            sid = int(sku_id)
            s = db.session.get(SKU, sid)
            if s:
                return s.id
            return None
        except (ValueError, TypeError):
            return None
    sku_str = data.get("sku") or auto_sku_str
    if sku_str and isinstance(sku_str, str) and sku_str.strip():
        sku_val = sku_str.strip().upper()
        s = SKU.query.filter_by(sku=sku_val).first()
        if not s:
            s = SKU(sku=sku_val)
            db.session.add(s)
            db.session.flush()
        return s.id
    return None

def resolve_tipo_id(data):
    tipo_id = data.get("tipo_id")
    if tipo_id is not None:
        try:
            tid = int(tipo_id)
            t = db.session.get(Tipo, tid)
            if t:
                return t.id
            return None
        except (ValueError, TypeError):
            return None
    tipo_code = data.get("tipo") or data.get("tipo_codigo")
    if tipo_code and isinstance(tipo_code, str) and tipo_code.strip():
        code = tipo_code.strip().upper()
        t = Tipo.query.filter(db.func.upper(Tipo.codigo) == code).first()
        if not t:
            t = Tipo(codigo=code, para=code, genero="Unissex")
            db.session.add(t)
            db.session.flush()
        return t.id
    return None

def resolve_cor_id(data):
    cor_id = data.get("cor_id")
    if cor_id is not None:
        try:
            cid = int(cor_id)
            c = db.session.get(Cor, cid)
            if c:
                return c.id
            return None
        except (ValueError, TypeError):
            return None
    cor_str = data.get("cor")
    if cor_str and isinstance(cor_str, str) and cor_str.strip():
        cor_val = cor_str.strip().upper()
        c = Cor.query.filter(db.func.upper(Cor.cor) == cor_val).first()
        if not c:
            c = Cor(cor=cor_val)
            db.session.add(c)
            db.session.flush()
        return c.id
    return None

def resolve_tamanho_id(data):
    tamanho_id = data.get("tamanho_id")
    if tamanho_id is not None:
        try:
            tam_id = int(tamanho_id)
            t = db.session.get(Tamanho, tam_id)
            if t:
                return t.id
            return None
        except (ValueError, TypeError):
            return None
    tam_str = data.get("tamanho")
    if tam_str and isinstance(tam_str, str) and tam_str.strip():
        tam_val = tam_str.strip().upper()
        tam = Tamanho.query.filter(db.func.upper(Tamanho.tamanho) == tam_val).first()
        if not tam:
            tam = Tamanho(tamanho=tam_val)
            db.session.add(tam)
            db.session.flush()
        return tam.id
    return None

def resolve_design_id(data, codigo_estampa_int=None, brand_id=None):
    design_id = data.get("design_id")
    if design_id is not None:
        try:
            did = int(design_id)
            d = db.session.get(Design, did)
            if d:
                return d.id
            return None
        except (ValueError, TypeError):
            return None

    nome_design = data.get("nome_design")
    codigo_estampa_val = data.get("codigo_estampa") if data.get("codigo_estampa") is not None else codigo_estampa_int
    code_str = str(codigo_estampa_val).strip() if codigo_estampa_val is not None and str(codigo_estampa_val).strip() != "" else None

    # 1. Search by nome_design
    if nome_design and isinstance(nome_design, str) and nome_design.strip():
        nome_val = nome_design.strip()
        d = Design.query.filter(db.func.lower(Design.nome_design) == nome_val.lower()).first()
        if d:
            if code_str and not d.codigo_estampa:
                d.codigo_estampa = code_str
                db.session.flush()
            return d.id

    # 2. Search by codigo_estampa
    if code_str:
        d = Design.query.filter(Design.codigo_estampa == code_str).first()
        if d:
            if nome_design and isinstance(nome_design, str) and nome_design.strip() and d.nome_design != nome_design.strip():
                pass
            return d.id

    # 3. Create new design with both nome_design and codigo_estampa
    if nome_design and isinstance(nome_design, str) and nome_design.strip():
        nome_val = nome_design.strip()
        d = Design(nome_design=nome_val, codigo_estampa=code_str)
        db.session.add(d)
        db.session.flush()
        return d.id

    # 4. Fallback if only codigo_estampa is present
    if code_str:
        fallback_name = f"Estampa {code_str}"
        d = Design.query.filter_by(nome_design=fallback_name).first()
        if not d:
            d = Design(nome_design=fallback_name, codigo_estampa=code_str)
            db.session.add(d)
            db.session.flush()
        return d.id

    fallback_name = "Design Padrao"
    d = Design.query.filter_by(nome_design=fallback_name).first()
    if not d:
        d = Design(nome_design=fallback_name)
        db.session.add(d)
        db.session.flush()
    return d.id



def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_initial_data()

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "online",
            "servico": "HC_comp Estoque API",
            "versao": "0.1v",
            "banco_dados": "SQLAlchemy + SQLite",
            "mensagem": "Todo esta listo para comenzar a crear tu gran proyecto."
        }), 200

    # -------------------------------------------------------------------
    # MARCAS (BRANDS)
    # -------------------------------------------------------------------
    @app.route("/api/brands", methods=["GET"])
    def get_brands():
        brands = Brand.query.all()
        return jsonify([b.to_dict() for b in brands]), 200

    @app.route("/api/brands", methods=["POST"])
    def create_brand():
        data = request.get_json() or {}
        name = data.get("name", "").strip() if isinstance(data.get("name"), str) else None
        slug = data.get("slug", "").strip() if isinstance(data.get("slug"), str) else None
        domain = data.get("domain", "").strip() if isinstance(data.get("domain"), str) else None

        if not name or not slug or not domain:
            return jsonify({"erro": "Campos obrigatórios: name, slug, domain"}), 400

        brand = Brand(name=name, slug=slug, domain=domain)
        try:
            db.session.add(brand)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": f"Slug '{slug}' já existe."}), 400

        return jsonify(brand.to_dict()), 201

    @app.route("/api/brands/<int:id>", methods=["GET"])
    def get_brand(id):
        brand = db.session.get(Brand, id)
        if not brand:
            return jsonify({"erro": "Marca não encontrada"}), 404
        return jsonify(brand.to_dict()), 200

    @app.route("/api/brands/<int:id>", methods=["PUT"])
    def update_brand(id):
        brand = db.session.get(Brand, id)
        if not brand:
            return jsonify({"erro": "Marca não encontrada"}), 404
        data = request.get_json() or {}
        if "name" in data:
            brand.name = str(data["name"]).strip()
        if "slug" in data:
            brand.slug = str(data["slug"]).strip()
        if "domain" in data:
            brand.domain = str(data["domain"]).strip()
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": "Slug duplicado"}), 400
        return jsonify(brand.to_dict()), 200

    @app.route("/api/brands/<int:id>", methods=["DELETE"])
    def delete_brand(id):
        brand = db.session.get(Brand, id)
        if not brand:
            return jsonify({"erro": "Marca não encontrada"}), 404
        db.session.delete(brand)
        db.session.commit()
        return jsonify({"mensagem": "Marca removida com sucesso"}), 200

    # -------------------------------------------------------------------
    # CORES
    # -------------------------------------------------------------------
    @app.route("/api/cores", methods=["GET"])
    def get_cores():
        cores = Cor.query.all()
        return jsonify([c.to_dict() for c in cores]), 200

    @app.route("/api/cores", methods=["POST"])
    def create_cor():
        data = request.get_json() or {}
        cor_val = data.get("cor", "").strip().upper() if isinstance(data.get("cor"), str) else None
        if not cor_val:
            return jsonify({"erro": "Campo obrigatório: cor"}), 400
        cor_obj = Cor(cor=cor_val)
        try:
            db.session.add(cor_obj)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": f"Cor '{cor_val}' já cadastrada."}), 400
        return jsonify(cor_obj.to_dict()), 201

    @app.route("/api/cores/<int:id>", methods=["GET"])
    def get_cor(id):
        cor_obj = db.session.get(Cor, id)
        if not cor_obj:
            return jsonify({"erro": "Cor não encontrada"}), 404
        return jsonify(cor_obj.to_dict()), 200

    @app.route("/api/cores/<int:id>", methods=["PUT"])
    def update_cor(id):
        cor_obj = db.session.get(Cor, id)
        if not cor_obj:
            return jsonify({"erro": "Cor não encontrada"}), 404
        data = request.get_json() or {}
        if "cor" in data:
            cor_obj.cor = str(data["cor"]).strip().upper()
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": "Cor duplicada"}), 400
        return jsonify(cor_obj.to_dict()), 200

    @app.route("/api/cores/<int:id>", methods=["DELETE"])
    def delete_cor(id):
        cor_obj = db.session.get(Cor, id)
        if not cor_obj:
            return jsonify({"erro": "Cor não encontrada"}), 404
        db.session.delete(cor_obj)
        db.session.commit()
        return jsonify({"mensagem": "Cor removida com sucesso"}), 200

    # -------------------------------------------------------------------
    # DESIGNS
    # -------------------------------------------------------------------
    @app.route("/api/designs", methods=["GET"])
    @app.route("/api/designs/buscar", methods=["GET"])
    def get_designs():
        q = request.args.get("q")
        codigo = request.args.get("codigo_estampa") or request.args.get("Cod_Estampa") or request.args.get("codigo")
        nome = request.args.get("nome_design") or request.args.get("nome")

        query = Design.query
        if q:
            termo = f"%{q.strip()}%"
            query = query.filter(
                (Design.nome_design.ilike(termo)) |
                (Design.codigo_estampa.like(termo))
            )
        if codigo:
            code_str = str(codigo).strip()
            query = query.filter((Design.codigo_estampa == code_str) | (Design.codigo_estampa.like(f"%{code_str}%")))
        if nome:
            query = query.filter(Design.nome_design.ilike(f"%{nome.strip()}%"))

        designs = query.all()
        return jsonify([d.to_dict() for d in designs]), 200

    @app.route("/api/designs", methods=["POST"])
    def create_design():
        data = request.get_json() or {}
        nome_design = data.get("nome_design", "").strip() if isinstance(data.get("nome_design"), str) else None
        codigo_estampa = data.get("codigo_estampa") or data.get("Cod_Estampa")
        code_str = str(codigo_estampa).strip() if codigo_estampa is not None and str(codigo_estampa).strip() != "" else None

        if not nome_design:
            return jsonify({"erro": "Campo obrigatório: nome_design"}), 400

        existing = Design.query.filter(db.func.lower(Design.nome_design) == nome_design.lower()).first()
        if existing:
            if code_str and not existing.codigo_estampa:
                existing.codigo_estampa = code_str
                db.session.commit()
            return jsonify(existing.to_dict()), 200

        design = Design(nome_design=nome_design, codigo_estampa=code_str)
        try:
            db.session.add(design)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": f"Design '{nome_design}' já cadastrado."}), 400
        return jsonify(design.to_dict()), 201

    @app.route("/api/designs/<int:id>", methods=["GET"])
    def get_design(id):
        design = db.session.get(Design, id)
        if not design:
            return jsonify({"erro": "Design não encontrado"}), 404
        return jsonify(design.to_dict()), 200

    @app.route("/api/designs/<int:id>", methods=["PUT"])
    def update_design(id):
        design = db.session.get(Design, id)
        if not design:
            return jsonify({"erro": "Design não encontrado"}), 404
        data = request.get_json() or {}
        if "nome_design" in data:
            design.nome_design = str(data["nome_design"]).strip()
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": "Design duplicado"}), 400
        return jsonify(design.to_dict()), 200

    @app.route("/api/designs/<int:id>", methods=["DELETE"])
    def delete_design(id):
        design = db.session.get(Design, id)
        if not design:
            return jsonify({"erro": "Design não encontrado"}), 404
        db.session.delete(design)
        db.session.commit()
        return jsonify({"mensagem": "Design removido com sucesso"}), 200

    # -------------------------------------------------------------------
    # SKUS
    # -------------------------------------------------------------------
    @app.route("/api/skus", methods=["GET"])
    def get_skus():
        skus = SKU.query.all()
        return jsonify([s.to_dict() for s in skus]), 200

    @app.route("/api/skus", methods=["POST"])
    def create_sku():
        data = request.get_json() or {}
        sku_val = data.get("sku", "").strip().upper() if isinstance(data.get("sku"), str) else None
        if not sku_val:
            return jsonify({"erro": "Campo obrigatório: sku"}), 400
        sku_obj = SKU(sku=sku_val)
        try:
            db.session.add(sku_obj)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": f"SKU '{sku_val}' já cadastrado."}), 400
        return jsonify(sku_obj.to_dict()), 201

    @app.route("/api/skus/<int:id>", methods=["GET"])
    def get_sku(id):
        sku_obj = db.session.get(SKU, id)
        if not sku_obj:
            return jsonify({"erro": "SKU não encontrado"}), 404
        return jsonify(sku_obj.to_dict()), 200

    @app.route("/api/skus/<int:id>", methods=["PUT"])
    def update_sku(id):
        sku_obj = db.session.get(SKU, id)
        if not sku_obj:
            return jsonify({"erro": "SKU não encontrado"}), 404
        data = request.get_json() or {}
        if "sku" in data:
            sku_obj.sku = str(data["sku"]).strip().upper()
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": "SKU duplicado"}), 400
        return jsonify(sku_obj.to_dict()), 200

    @app.route("/api/skus/<int:id>", methods=["DELETE"])
    def delete_sku(id):
        sku_obj = db.session.get(SKU, id)
        if not sku_obj:
            return jsonify({"erro": "SKU não encontrado"}), 404
        db.session.delete(sku_obj)
        db.session.commit()
        return jsonify({"mensagem": "SKU removido com sucesso"}), 200

    # -------------------------------------------------------------------
    # TAMANHOS
    # -------------------------------------------------------------------
    @app.route("/api/tamanhos", methods=["GET"])
    def get_tamanhos():
        tamanhos = Tamanho.query.all()
        return jsonify([t.to_dict() for t in tamanhos]), 200

    @app.route("/api/tamanhos", methods=["POST"])
    def create_tamanho():
        data = request.get_json() or {}
        tamanho_val = data.get("tamanho", "").strip().upper() if isinstance(data.get("tamanho"), str) else None
        if not tamanho_val:
            return jsonify({"erro": "Campo obrigatório: tamanho"}), 400
        tamanho_obj = Tamanho(tamanho=tamanho_val)
        db.session.add(tamanho_obj)
        db.session.commit()
        return jsonify(tamanho_obj.to_dict()), 201

    @app.route("/api/tamanhos/<int:id>", methods=["GET"])
    def get_tamanho(id):
        tamanho_obj = db.session.get(Tamanho, id)
        if not tamanho_obj:
            return jsonify({"erro": "Tamanho não encontrado"}), 404
        return jsonify(tamanho_obj.to_dict()), 200

    @app.route("/api/tamanhos/<int:id>", methods=["PUT"])
    def update_tamanho(id):
        tamanho_obj = db.session.get(Tamanho, id)
        if not tamanho_obj:
            return jsonify({"erro": "Tamanho não encontrado"}), 404
        data = request.get_json() or {}
        if "tamanho" in data:
            tamanho_obj.tamanho = str(data["tamanho"]).strip().upper()
        db.session.commit()
        return jsonify(tamanho_obj.to_dict()), 200

    @app.route("/api/tamanhos/<int:id>", methods=["DELETE"])
    def delete_tamanho(id):
        tamanho_obj = db.session.get(Tamanho, id)
        if not tamanho_obj:
            return jsonify({"erro": "Tamanho não encontrado"}), 404
        db.session.delete(tamanho_obj)
        db.session.commit()
        return jsonify({"mensagem": "Tamanho removido com sucesso"}), 200

    # -------------------------------------------------------------------
    # TIPOS
    # -------------------------------------------------------------------
    @app.route("/api/tipos", methods=["GET"])
    def get_tipos():
        tipos = Tipo.query.all()
        return jsonify([t.to_dict() for t in tipos]), 200

    @app.route("/api/tipos", methods=["POST"])
    def create_tipo():
        data = request.get_json() or {}
        codigo = data.get("codigo", "").strip().upper() if isinstance(data.get("codigo"), str) else None
        para = data.get("para", "").strip() if isinstance(data.get("para"), str) else None
        genero = data.get("genero", "").strip() if isinstance(data.get("genero"), str) else None

        if not codigo:
            return jsonify({"erro": "Campo obrigatório: codigo"}), 400
        tipo_obj = Tipo(codigo=codigo, para=para, genero=genero)
        db.session.add(tipo_obj)
        db.session.commit()
        return jsonify(tipo_obj.to_dict()), 201

    @app.route("/api/tipos/<int:id>", methods=["GET"])
    def get_tipo(id):
        tipo_obj = db.session.get(Tipo, id)
        if not tipo_obj:
            return jsonify({"erro": "Tipo não encontrado"}), 404
        return jsonify(tipo_obj.to_dict()), 200

    @app.route("/api/tipos/<int:id>", methods=["PUT"])
    def update_tipo(id):
        tipo_obj = db.session.get(Tipo, id)
        if not tipo_obj:
            return jsonify({"erro": "Tipo não encontrado"}), 404
        data = request.get_json() or {}
        if "codigo" in data:
            tipo_obj.codigo = str(data["codigo"]).strip().upper()
        if "para" in data:
            tipo_obj.para = str(data["para"]).strip()
        if "genero" in data:
            tipo_obj.genero = str(data["genero"]).strip()
        db.session.commit()
        return jsonify(tipo_obj.to_dict()), 200

    @app.route("/api/tipos/<int:id>", methods=["DELETE"])
    def delete_tipo(id):
        tipo_obj = db.session.get(Tipo, id)
        if not tipo_obj:
            return jsonify({"erro": "Tipo não encontrado"}), 404
        db.session.delete(tipo_obj)
        db.session.commit()
        return jsonify({"mensagem": "Tipo removido com sucesso"}), 200

    # -------------------------------------------------------------------
    # ESTAMPAS (INVENTARIO)
    # -------------------------------------------------------------------
    @app.route("/api/estampas", methods=["GET"])
    def get_estampas():
        brand_id = request.args.get("brand_id", type=int)
        cor_id = request.args.get("cor_id", type=int)
        cor = request.args.get("cor")
        busca = request.args.get("q")

        include_zero = request.args.get("include_zero", "false").lower() == "true"
        query = Estampa.query.join(Design).join(Cor).join(Brand)
        if not include_zero:
            query = query.filter(Estampa.quantidade > 0)
        if brand_id:
            query = query.filter(Estampa.brand_id == brand_id)
        if cor_id:
            query = query.filter(Estampa.cor_id == cor_id)
        if cor:
            query = query.filter(db.func.upper(Cor.cor) == cor.strip().upper())
        if busca:
            termo = f"%{busca}%"
            query = query.filter(
                (db.cast(Estampa.codigo_estampa, db.String).like(termo)) |
                (Design.nome_design.ilike(termo))
            )

        estampas = query.order_by(Estampa.codigo_estampa).all()
        return jsonify([e.to_dict() for e in estampas]), 200

    @app.route("/api/estampas/<int:id>", methods=["GET"])
    def get_estampa(id):
        estampa = db.session.get(Estampa, id)
        if not estampa:
            return jsonify({"erro": "Estampa não encontrada"}), 404
        return jsonify(estampa.to_dict()), 200

    @app.route("/api/estampas", methods=["POST"])
    def create_estampa():
        data = request.get_json() or {}
        
        brand_id = resolve_brand_id(data)
        if not brand_id:
            return jsonify({"erro": "Brand inválido ou não informado."}), 404

        codigo_estampa_raw = data.get("codigo_estampa")
        if codigo_estampa_raw is None or str(codigo_estampa_raw).strip() == "":
            return jsonify({"erro": "Campo obrigatório: codigo_estampa"}), 400
        codigo_estampa = parse_codigo_estampa_int(codigo_estampa_raw)

        cor_id = resolve_cor_id(data)
        if not cor_id:
            return jsonify({"erro": "Cor inválida ou não informada."}), 404

        design_id = resolve_design_id(data, codigo_estampa_int=codigo_estampa, brand_id=brand_id)
        if not design_id:
            return jsonify({"erro": "Design não pôde ser determinado."}), 404

        sku_id = resolve_sku_id(data)

        try:
            quantidade = int(data.get("quantidade", 0))
        except (ValueError, TypeError):
            return jsonify({"erro": "Quantidade deve ser um valor numérico."}), 400

        if quantidade < 0:
            return jsonify({"erro": "A quantidade não pode ser negativa."}), 400

        # Upsert: se já existe estampa com o mesmo codigo_estampa, brand_id e cor_id, apenas soma a quantidade
        existing_estampa = Estampa.query.filter_by(
            codigo_estampa=codigo_estampa,
            brand_id=brand_id,
            cor_id=cor_id
        ).first()

        if not existing_estampa:
            existing_estampa = Estampa.query.filter_by(
                codigo_estampa=codigo_estampa,
                brand_id=brand_id
            ).first()

        if existing_estampa:
            existing_estampa.quantidade += quantidade
            if design_id:
                existing_estampa.design_id = design_id
            db.session.commit()
            return jsonify(existing_estampa.to_dict()), 200

        estampa = Estampa(
            codigo_estampa=codigo_estampa,
            design_id=design_id,
            cor_id=cor_id,
            quantidade=quantidade,
            brand_id=brand_id,
            sku_id=sku_id
        )
        try:
            db.session.add(estampa)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": f"Combinação (codigo_estampa={codigo_estampa}, brand_id={brand_id}) já existe."}), 400

        return jsonify(estampa.to_dict()), 201

    @app.route("/api/estampas/<int:id>", methods=["PUT"])
    def update_estampa(id):
        estampa = db.session.get(Estampa, id)
        if not estampa:
            return jsonify({"erro": "Estampa não encontrada"}), 404

        data = request.get_json() or {}

        if "quantidade" in data:
            try:
                qtd = int(data["quantidade"])
                if qtd < 0:
                    return jsonify({"erro": "A quantidade não pode ser negativa."}), 400
                estampa.quantidade = qtd
            except (ValueError, TypeError):
                return jsonify({"erro": "Quantidade deve ser numérica"}), 400

        if "codigo_estampa" in data:
            codigo_estampa_raw = data["codigo_estampa"]
            if codigo_estampa_raw is not None and str(codigo_estampa_raw).strip() != "":
                estampa.codigo_estampa = parse_codigo_estampa_int(codigo_estampa_raw)

        if "design_id" in data or "nome_design" in data:
            did = resolve_design_id(data, codigo_estampa_int=estampa.codigo_estampa, brand_id=estampa.brand_id)
            if did:
                estampa.design_id = did

        if "cor_id" in data or "cor" in data:
            cid = resolve_cor_id(data)
            if cid:
                estampa.cor_id = cid

        if "brand_id" in data:
            bid = resolve_brand_id(data)
            if bid:
                estampa.brand_id = bid

        if "sku_id" in data or "sku" in data:
            sid = resolve_sku_id(data)
            if sid:
                estampa.sku_id = sid

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": "Violação de integridade nos campos atualizados."}), 400

        return jsonify(estampa.to_dict()), 200

    @app.route("/api/estampas/<int:id>", methods=["DELETE"])
    def delete_estampa(id):
        estampa = db.session.get(Estampa, id)
        if not estampa:
            return jsonify({"erro": "Estampa não encontrada"}), 404
        db.session.delete(estampa)
        db.session.commit()
        return jsonify({"mensagem": f"Estampa {estampa.id} removida com sucesso"}), 200

    # -------------------------------------------------------------------
    # PEÇAS PRONTAS (INVENTARIO)
    # -------------------------------------------------------------------
    @app.route("/api/pecas-prontas", methods=["GET"])
    def get_pecas_prontas():
        brand_id = request.args.get("brand_id", type=int)
        tipo_id = request.args.get("tipo_id", type=int)
        tamanho_id = request.args.get("tamanho_id", type=int)
        cor_id = request.args.get("cor_id", type=int)
        busca = request.args.get("q")
        include_zero = request.args.get("include_zero", "false").lower() == "true"

        query = PecaPronta.query.join(SKU).join(Tipo).join(Design).join(Cor).join(Tamanho).join(Brand)
        if not include_zero:
            query = query.filter(PecaPronta.quantidade > 0)
        if brand_id:
            query = query.filter(PecaPronta.brand_id == brand_id)
        if tipo_id:
            query = query.filter(PecaPronta.tipo_id == tipo_id)
        if tamanho_id:
            query = query.filter(PecaPronta.tamanho_id == tamanho_id)
        if cor_id:
            query = query.filter(PecaPronta.cor_id == cor_id)
        if busca:
            termo = f"%{busca}%"
            query = query.filter(
                (SKU.sku.ilike(termo)) |
                (Design.codigo_estampa.like(termo)) |
                (Design.nome_design.ilike(termo))
            )

        pecas = query.all()
        return jsonify([p.to_dict() for p in pecas]), 200

    @app.route("/api/pecas-prontas/<int:id>", methods=["GET"])
    def get_peca_pronta(id):
        peca = db.session.get(PecaPronta, id)
        if not peca:
            return jsonify({"erro": "Peça pronta não encontrada"}), 404
        return jsonify(peca.to_dict()), 200

    @app.route("/api/pecas-prontas", methods=["POST"])
    def create_peca_pronta():
        data = request.get_json() or {}

        try:
            brand_id = resolve_brand_id(data)
            if not brand_id:
                return jsonify({"erro": "Brand inválido ou não informado."}), 400

            codigo_estampa_raw = data.get("codigo_estampa")
            if codigo_estampa_raw is None or str(codigo_estampa_raw).strip() == "":
                return jsonify({"erro": "Campo obrigatório: codigo_estampa"}), 400
            codigo_estampa = parse_codigo_estampa_int(codigo_estampa_raw)

            tipo_id = resolve_tipo_id(data)
            if not tipo_id:
                return jsonify({"erro": "Tipo inválido ou não informado."}), 400

            cor_id = resolve_cor_id(data)
            if not cor_id:
                return jsonify({"erro": "Cor inválida ou não informada."}), 400

            tamanho_id = resolve_tamanho_id(data)
            if not tamanho_id:
                return jsonify({"erro": "Tamanho inválido ou não informado."}), 400

            design_id = resolve_design_id(data, codigo_estampa_int=codigo_estampa, brand_id=brand_id)
            if not design_id:
                return jsonify({"erro": "Design não pôde ser determinado."}), 400

            sku_id = resolve_sku_id(data)
            if not sku_id:
                return jsonify({"erro": "SKU não pôde ser determinado."}), 400

            try:
                quantidade = int(data.get("quantidade", 0))
            except (ValueError, TypeError):
                return jsonify({"erro": "Quantidade deve ser um valor numérico."}), 400

            if quantidade < 0:
                return jsonify({"erro": "A quantidade não pode ser negativa."}), 400

            # Upsert: se a peça já existe para o mesmo SKU e Marca, apenas soma a quantidade
            existing_peca = PecaPronta.query.filter_by(
                sku_id=sku_id,
                brand_id=brand_id
            ).first()

            if not existing_peca:
                existing_peca = PecaPronta.query.filter_by(
                    tipo_id=tipo_id,
                    design_id=design_id,
                    cor_id=cor_id,
                    tamanho_id=tamanho_id,
                    brand_id=brand_id
                ).first()

            if existing_peca:
                existing_peca.quantidade += quantidade
                if design_id:
                    existing_peca.design_id = design_id
                db.session.commit()
                return jsonify(existing_peca.to_dict()), 200

            peca = PecaPronta(
                sku_id=sku_id,
                tipo_id=tipo_id,
                design_id=design_id,
                cor_id=cor_id,
                tamanho_id=tamanho_id,
                quantidade=quantidade,
                brand_id=brand_id
            )
            db.session.add(peca)
            db.session.commit()
            return jsonify(peca.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            print("ERRO AO SALVAR PECA PRONTA:", str(e))
            import traceback
            traceback.print_exc()
            return jsonify({"erro": f"Erro ao salvar registro: {str(e)}"}), 500

    @app.route("/api/pecas-prontas/<int:id>", methods=["PUT"])
    def update_peca_pronta(id):
        peca = db.session.get(PecaPronta, id)
        if not peca:
            return jsonify({"erro": "Peça pronta não encontrada"}), 404

        data = request.get_json() or {}

        if "quantidade" in data:
            try:
                qtd = int(data["quantidade"])
                if qtd < 0:
                    return jsonify({"erro": "A quantidade não pode ser negativa."}), 400
                peca.quantidade = qtd
            except (ValueError, TypeError):
                return jsonify({"erro": "Quantidade deve ser numérica."}), 400

        if "sku_id" in data or "sku" in data:
            sid = resolve_sku_id(data)
            if sid:
                peca.sku_id = sid

        if "tipo_id" in data or "tipo" in data:
            tid = resolve_tipo_id(data)
            if tid:
                peca.tipo_id = tid

        if "codigo_estampa" in data:
            codigo_estampa_raw = data["codigo_estampa"]
            if codigo_estampa_raw is not None and str(codigo_estampa_raw).strip() != "":
                peca.codigo_estampa = parse_codigo_estampa_int(codigo_estampa_raw)

        if "design_id" in data or "nome_design" in data:
            did = resolve_design_id(data, codigo_estampa_int=peca.codigo_estampa, brand_id=peca.brand_id)
            if did:
                peca.design_id = did

        if "cor_id" in data or "cor" in data:
            cid = resolve_cor_id(data)
            if cid:
                peca.cor_id = cid

        if "tamanho_id" in data or "tamanho" in data:
            tam_id = resolve_tamanho_id(data)
            if tam_id:
                peca.tamanho_id = tam_id

        if "brand_id" in data:
            bid = resolve_brand_id(data)
            if bid:
                peca.brand_id = bid

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({"erro": "Erro de integridade ao atualizar peça pronta."}), 400

        return jsonify(peca.to_dict()), 200

    @app.route("/api/pecas-prontas/<int:id>", methods=["DELETE"])
    def delete_peca_pronta(id):
        peca = db.session.get(PecaPronta, id)
        if not peca:
            return jsonify({"erro": "Peça pronta não encontrada"}), 404
        db.session.delete(peca)
        db.session.commit()
        return jsonify({"mensagem": f"Peça pronta {peca.id} removida com sucesso"}), 200

    # -------------------------------------------------------------------
    # VERIFICADOR DE DISPONIBILIDADE E CONSUMO DE ESTOQUE
    # -------------------------------------------------------------------
    @app.route("/api/verificar-disponibilidade", methods=["GET"])
    def verificar_disponibilidade():
        termo = request.args.get("sku", "").strip()
        termo_upper = termo.upper() if termo else ""
        brand_id = request.args.get("brand_id", type=int)
        brand_prefix = request.args.get("brand_prefix", "").strip().upper()
        cor = request.args.get("cor", "").strip().upper()
        tipo = request.args.get("tipo", "").strip().upper()

        if brand_prefix and not brand_id:
            if brand_prefix == "CR":
                b = Brand.query.filter(Brand.name.ilike("%Rock%")).first()
                if b: brand_id = b.id
            elif brand_prefix == "RN":
                b = Brand.query.filter(Brand.name.ilike("%Ride%")).first()
                if b: brand_id = b.id

        termo_like = f"%{termo}%" if termo else None

        # 1. Buscar Peças Prontas correspondentes
        pecas_query = PecaPronta.query.join(Brand).join(SKU).join(Cor).join(Tipo).join(Design)
        if brand_id:
            pecas_query = pecas_query.filter(PecaPronta.brand_id == brand_id)
        if cor and cor != "TODOS":
            pecas_query = pecas_query.filter(db.func.upper(Cor.cor) == cor)
        if tipo and tipo != "TODOS":
            pecas_query = pecas_query.filter(db.func.upper(Tipo.codigo) == tipo)

        if termo_like:
            pecas_query = pecas_query.filter(
                (SKU.sku.ilike(termo_like)) |
                (Design.codigo_estampa.like(termo_like)) |
                (Tipo.codigo.ilike(termo_like)) |
                (Cor.cor.ilike(termo_like)) |
                (Brand.name.ilike(termo_like))
            )
        pecas_encontradas = pecas_query.all()

        # 2. Buscar Estampas Avulsas correspondentes
        estampas_query = Estampa.query.join(Brand).join(Design).join(Cor)
        if brand_id:
            estampas_query = estampas_query.filter(Estampa.brand_id == brand_id)
        if cor and cor != "TODOS":
            estampas_query = estampas_query.filter(db.func.upper(Cor.cor) == cor)

        if termo_like:
            estampas_query = estampas_query.filter(
                (db.cast(Estampa.codigo_estampa, db.String).like(termo_like)) |
                (Design.nome_design.ilike(termo_like)) |
                (Cor.cor.ilike(termo_like)) |
                (Brand.name.ilike(termo_like))
            )
        estampas_encontradas = estampas_query.all()

        resultados_pecas = []
        for p in pecas_encontradas:
            est_assoc = Estampa.query.filter(Estampa.codigo_estampa == p.codigo_estampa).first()
            status_code = "PRONTO" if p.quantidade > 0 else "SEM_ESTOQUE"
            status_label = "Pronto para Envio" if p.quantidade > 0 else "Sem Estoque"
            badge_color = "emerald" if p.quantidade > 0 else "rose"

            resultados_pecas.append({
                "categoria": "peca",
                "id": p.id,
                "sku": p.sku_rel.sku if p.sku_rel else str(p.sku_id),
                "tipo": p.tipo_rel.codigo if p.tipo_rel else str(p.tipo_id),
                "codigo_estampa": p.codigo_estampa,
                "nome_design": p.design.nome_design if p.design else (est_assoc.design.nome_design if est_assoc and est_assoc.design else "Peça Pronta"),
                "cor": p.cor_rel.cor if p.cor_rel else str(p.cor_id),
                "tamanho": p.tamanho_rel.tamanho if p.tamanho_rel else str(p.tamanho_id),
                "brand_id": p.brand_id,
                "brand_name": p.brand.name if p.brand else "Geral",
                "quantidade": p.quantidade,
                "status_code": status_code,
                "status_label": status_label,
                "badge_color": badge_color
            })

        resultados_estampas = []
        for e in estampas_encontradas:
            status_code = "ESTAMPAR" if e.quantidade > 0 else "SEM_ESTOQUE"
            status_label = "Disponível para Estampar" if e.quantidade > 0 else "Sem Estoque"
            badge_color = "amber" if e.quantidade > 0 else "rose"

            resultados_estampas.append({
                "categoria": "estampa",
                "id": e.id,
                "sku": str(e.codigo_estampa),
                "codigo_estampa": e.codigo_estampa,
                "nome_design": e.design.nome_design if e.design else "Sem Nome",
                "cor": e.cor_rel.cor if e.cor_rel else str(e.cor_id),
                "brand_id": e.brand_id,
                "brand_name": e.brand.name if e.brand else "Geral",
                "quantidade": e.quantidade,
                "status_code": status_code,
                "status_label": status_label,
                "badge_color": badge_color
            })

        total_encontrados = len(resultados_pecas) + len(resultados_estampas)
        primeiro_res = resultados_pecas[0] if resultados_pecas else (resultados_estampas[0] if resultados_estampas else None)

        return jsonify({
            "termo_busca": termo,
            "total_encontrados": total_encontrados,
            "pecas": resultados_pecas,
            "estampas": resultados_estampas,
            "sku": primeiro_res["sku"] if primeiro_res else termo_upper,
            "codigo_estampa": primeiro_res["codigo_estampa"] if primeiro_res else termo_upper,
            "nome_design_estampa": primeiro_res["nome_design"] if primeiro_res else "Não encontrada",
            "brand_id": primeiro_res["brand_id"] if primeiro_res else brand_id,
            "brand_name": primeiro_res["brand_name"] if primeiro_res else "Geral",
            "peca_pronta_qtd": sum(p["quantidade"] for p in resultados_pecas),
            "estampa_qtd": sum(e["quantidade"] for e in resultados_estampas),
            "status_code": primeiro_res["status_code"] if primeiro_res else "SEM_ESTOQUE",
            "status_label": primeiro_res["status_label"] if primeiro_res else "Sem Estoque",
            "badge_color": primeiro_res["badge_color"] if primeiro_res else "rose"
        }), 200

    @app.route("/api/usar-estoque", methods=["POST"])
    def usar_estoque():
        data = request.get_json() or {}
        categoria = data.get("categoria")
        item_id = data.get("id")
        try:
            qtd_usar = int(data.get("quantidade", 1))
        except (ValueError, TypeError):
            return jsonify({"erro": "Quantidade deve ser numérica."}), 400

        if not categoria or not item_id or qtd_usar <= 0:
            return jsonify({"erro": "Informe categoria ('peca' ou 'estampa'), ID do produto e quantidade válida maiores que 0."}), 400

        if categoria == "peca":
            peca = db.session.get(PecaPronta, item_id)
            if not peca:
                return jsonify({"erro": "Peça pronta não encontrada no estoque."}), 404
            if peca.quantidade < qtd_usar:
                return jsonify({"erro": f"Estoque insuficiente. Disponível: {peca.quantidade}, solicitado: {qtd_usar}"}), 400
            
            peca.quantidade -= qtd_usar
            db.session.commit()
            return jsonify({
                "mensagem": f"Sucesso! {qtd_usar} unidade(s) baixada(s) do estoque.",
                "item": peca.to_dict()
            }), 200

        elif categoria == "estampa":
            estampa = db.session.get(Estampa, item_id)
            if not estampa:
                return jsonify({"erro": "Estampa avulsa não encontrada no estoque."}), 404
            if estampa.quantidade < qtd_usar:
                return jsonify({"erro": f"Estoque insuficiente. Disponível: {estampa.quantidade}, solicitado: {qtd_usar}"}), 400
            
            estampa.quantidade -= qtd_usar
            db.session.commit()
            return jsonify({
                "mensagem": f"Sucesso! {qtd_usar} unidade(s) da estampa baixada(s) do estoque.",
                "item": estampa.to_dict()
            }), 200

        return jsonify({"erro": "Categoria inválida para consumo."}), 400

    return app

def seed_initial_data():
    if not Brand.query.first():
        b1 = Brand(name="Clube Rock", slug="clube-rock", domain="https://www.cluberock.com.br/")
        b2 = Brand(name="Ride Nation", slug="ride-nation", domain="https://www.ridenation.com.br/")
        db.session.add_all([b1, b2])

        c1 = Cor(cor="PRE")
        c2 = Cor(cor="BRA")
        c3 = Cor(cor="AMA")
        db.session.add_all([c1, c2, c3])

        d1 = Design(nome_design="Caveira Rocker Classic")
        d2 = Design(nome_design="Vintage Guitar Solos")
        d3 = Design(nome_design="Psychedelic Wings")
        d4 = Design(nome_design="Full Throttle Biker")
        d5 = Design(nome_design="Speed Customs 1978")
        db.session.add_all([d1, d2, d3, d4, d5])

        s1 = SKU(sku="CR-CM-001-PRE-M")
        s2 = SKU(sku="CR-CM-001-PRE-G")
        s3 = SKU(sku="CR-MO-002-BRA-GG")
        s4 = SKU(sku="RN-CM-010-PRE-G")
        s5 = SKU(sku="RN-CF-011-BRA-M")
        s6 = SKU(sku="RN-MO-010-PRE-P")
        db.session.add_all([s1, s2, s3, s4, s5, s6])

        t1 = Tamanho(tamanho="P")
        t2 = Tamanho(tamanho="M")
        t3 = Tamanho(tamanho="G")
        t4 = Tamanho(tamanho="GG")
        db.session.add_all([t1, t2, t3, t4])

        tp1 = Tipo(codigo="CM", para="Camiseta", genero="Unissex")
        tp2 = Tipo(codigo="MO", para="Moleton", genero="Unissex")
        tp3 = Tipo(codigo="CF", para="Camiseta Feminina", genero="Feminino")
        db.session.add_all([tp1, tp2, tp3])

        db.session.commit()

        # Seed Estampas
        e1 = Estampa(codigo_estampa=1, design_id=d1.id, cor_id=c1.id, quantidade=25, brand_id=b1.id, sku_id=s1.id)
        e2 = Estampa(codigo_estampa=2, design_id=d2.id, cor_id=c2.id, quantidade=10, brand_id=b1.id, sku_id=s3.id)
        e3 = Estampa(codigo_estampa=3, design_id=d3.id, cor_id=c3.id, quantidade=8, brand_id=b1.id)
        e4 = Estampa(codigo_estampa=10, design_id=d4.id, cor_id=c1.id, quantidade=15, brand_id=b2.id, sku_id=s4.id)
        e5 = Estampa(codigo_estampa=11, design_id=d5.id, cor_id=c2.id, quantidade=4, brand_id=b2.id, sku_id=s5.id)
        db.session.add_all([e1, e2, e3, e4, e5])
        db.session.commit()

        # Seed Peças Prontas
        p1 = PecaPronta(sku_id=s1.id, tipo_id=tp1.id, codigo_estampa=1, design_id=d1.id, cor_id=c1.id, tamanho_id=t2.id, quantidade=4, brand_id=b1.id)
        p2 = PecaPronta(sku_id=s2.id, tipo_id=tp1.id, codigo_estampa=1, design_id=d1.id, cor_id=c1.id, tamanho_id=t3.id, quantidade=0, brand_id=b1.id)
        p3 = PecaPronta(sku_id=s3.id, tipo_id=tp2.id, codigo_estampa=2, design_id=d2.id, cor_id=c2.id, tamanho_id=t4.id, quantidade=2, brand_id=b1.id)
        p4 = PecaPronta(sku_id=s4.id, tipo_id=tp1.id, codigo_estampa=10, design_id=d4.id, cor_id=c1.id, tamanho_id=t3.id, quantidade=3, brand_id=b2.id)
        p5 = PecaPronta(sku_id=s5.id, tipo_id=tp3.id, codigo_estampa=11, design_id=d5.id, cor_id=c2.id, tamanho_id=t2.id, quantidade=0, brand_id=b2.id)
        p6 = PecaPronta(sku_id=s6.id, tipo_id=tp2.id, codigo_estampa=10, design_id=d4.id, cor_id=c1.id, tamanho_id=t1.id, quantidade=0, brand_id=b2.id)
        db.session.add_all([p1, p2, p3, p4, p5, p6])
        db.session.commit()

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
