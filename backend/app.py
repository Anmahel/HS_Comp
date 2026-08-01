import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, Brand, Estampa, PecaPronta

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
 
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    with app.app_context():
        # Remove sqlite database file if schema changes or recreate tables
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

    # -------------------------------------------------------------------
    # ESTAMPAS (CRUD)
    # -------------------------------------------------------------------
    @app.route("/api/estampas", methods=["GET"])
    def get_estampas():
        brand_id = request.args.get("brand_id", type=int)
        cor = request.args.get("cor")
        busca = request.args.get("q")

        query = Estampa.query
        if brand_id:
            query = query.filter_by(brand_id=brand_id)
        if cor:
            query = query.filter_by(cor=cor.upper())
        if busca:
            termo = f"%{busca}%"
            query = query.filter((Estampa.codigo_estampa.like(termo)) | (Estampa.nome_design.like(termo)))

        estampas = query.order_by(Estampa.codigo_estampa).all()
        return jsonify([e.to_dict() for e in estampas]), 200

    @app.route("/api/estampas", methods=["POST"])
    def create_estampa():
        data = request.get_json() or {}
        codigo_estampa = data.get("codigo_estampa", "").strip().upper()
        nome_design = data.get("nome_design", "").strip()
        cor = data.get("cor", "").strip().upper()
        quantidade = data.get("quantidade", 0)
        brand_id = data.get("brand_id")

        if not codigo_estampa or not nome_design or not cor or not brand_id:
            return jsonify({"erro": "Campos obrigatórios: codigo_estampa, nome_design, cor, brand_id"}), 400

        estampa = Estampa(
            codigo_estampa=codigo_estampa,
            nome_design=nome_design,
            cor=cor,
            quantidade=quantidade,
            brand_id=brand_id
        )
        db.session.add(estampa)
        db.session.commit()
        return jsonify(estampa.to_dict()), 201

    @app.route("/api/estampas/<int:id>", methods=["PUT"])
    def update_estampa(id):
        estampa = Estampa.query.get_or_404(id)
        data = request.get_json() or {}

        if "quantidade" in data:
            estampa.quantidade = int(data["quantidade"])
        if "nome_design" in data:
            estampa.nome_design = data["nome_design"].strip()
        if "cor" in data:
            estampa.cor = data["cor"].strip().upper()
        if "brand_id" in data:
            estampa.brand_id = int(data["brand_id"])

        db.session.commit()
        return jsonify(estampa.to_dict()), 200

    @app.route("/api/estampas/<int:id>", methods=["DELETE"])
    def delete_estampa(id):
        estampa = Estampa.query.get_or_404(id)
        db.session.delete(estampa)
        db.session.commit()
        return jsonify({"mensagem": f"Estampa {estampa.codigo_estampa} removida com sucesso"}), 200

    # -------------------------------------------------------------------
    # PEÇAS PRONTAS (CRUD)
    # -------------------------------------------------------------------
    @app.route("/api/pecas-prontas", methods=["GET"])
    def get_pecas_prontas():
        brand_id = request.args.get("brand_id", type=int)
        tipo = request.args.get("tipo")
        tamanho = request.args.get("tamanho")
        cor = request.args.get("cor")
        busca = request.args.get("q")

        query = PecaPronta.query
        if brand_id:
            query = query.filter_by(brand_id=brand_id)
        if tipo:
            query = query.filter_by(tipo=tipo.upper())
        if tamanho:
            query = query.filter_by(tamanho=tamanho.upper())
        if cor:
            query = query.filter_by(cor=cor.upper())
        if busca:
            termo = f"%{busca}%"
            query = query.filter((PecaPronta.sku.like(termo)) | (PecaPronta.codigo_estampa.like(termo)))

        pecas = query.order_by(PecaPronta.sku).all()
        return jsonify([p.to_dict() for p in pecas]), 200

    @app.route("/api/pecas-prontas", methods=["POST"])
    def create_peca_pronta():
        data = request.get_json() or {}
        sku = data.get("sku", "").strip().upper()
        tipo = data.get("tipo", "").strip().upper()
        codigo_estampa = data.get("codigo_estampa", "").strip().upper()
        cor = data.get("cor", "").strip().upper()
        tamanho = data.get("tamanho", "").strip().upper()
        quantidade = data.get("quantidade", 0)
        brand_id = data.get("brand_id")

        if not sku or not tipo or not codigo_estampa or not cor or not tamanho or not brand_id:
            return jsonify({"erro": "Campos obrigatórios: sku, tipo, codigo_estampa, cor, tamanho, brand_id"}), 400

        existente = PecaPronta.query.filter_by(sku=sku).first()
        if existente:
            return jsonify({"erro": f"O SKU {sku} já está cadastrado no sistema."}), 400

        peca = PecaPronta(
            sku=sku,
            tipo=tipo,
            codigo_estampa=codigo_estampa,
            cor=cor,
            tamanho=tamanho,
            quantidade=quantidade,
            brand_id=brand_id
        )
        db.session.add(peca)
        db.session.commit()
        return jsonify(peca.to_dict()), 201

    @app.route("/api/pecas-prontas/<int:id>", methods=["PUT"])
    def update_peca_pronta(id):
        peca = PecaPronta.query.get_or_404(id)
        data = request.get_json() or {}

        if "quantidade" in data:
            peca.quantidade = int(data["quantidade"])
        if "tipo" in data:
            peca.tipo = data["tipo"].strip().upper()
        if "codigo_estampa" in data:
            peca.codigo_estampa = data["codigo_estampa"].strip().upper()
        if "cor" in data:
            peca.cor = data["cor"].strip().upper()
        if "tamanho" in data:
            peca.tamanho = data["tamanho"].strip().upper()
        if "brand_id" in data:
            peca.brand_id = int(data["brand_id"])
        if "sku" in data:
            peca.sku = data["sku"].strip().upper()
        else:
            peca.sku = f"{peca.tipo}-{peca.codigo_estampa}-{peca.cor}-{peca.tamanho}"

        db.session.commit()
        return jsonify(peca.to_dict()), 200

    @app.route("/api/pecas-prontas/<int:id>", methods=["DELETE"])
    def delete_peca_pronta(id):
        peca = PecaPronta.query.get_or_404(id)
        db.session.delete(peca)
        db.session.commit()
        return jsonify({"mensagem": f"SKU {peca.sku} removido com sucesso"}), 200

    # -------------------------------------------------------------------
    # VERIFICADOR DE DISPONIBILIDADE (LÓGICA PRINCIPAL DO NEGÓCIO)
    # -------------------------------------------------------------------
    # -------------------------------------------------------------------
    # VERIFICADOR DE DISPONIBILIDADE E CONSUMO DE ESTOQUE (LÓGICA PRINCIPAL)
    # -------------------------------------------------------------------
    @app.route("/api/verificar-disponibilidade", methods=["GET"])
    def verificar_disponibilidade():
        termo = request.args.get("sku", "").strip()
        brand_id = request.args.get("brand_id", type=int)
        brand_prefix = request.args.get("brand_prefix", "").strip().upper()
        cor = request.args.get("cor", "").strip().upper()
        tipo = request.args.get("tipo", "").strip().upper()

        # Determinar brand_id pelo brand_prefix se não informado brand_id
        if brand_prefix and not brand_id:
            if brand_prefix == "CR":
                b = Brand.query.filter(Brand.name.ilike("%Rock%")).first()
                if b: brand_id = b.id
            elif brand_prefix == "RN":
                b = Brand.query.filter(Brand.name.ilike("%Ride%")).first()
                if b: brand_id = b.id

        termo_like = f"%{termo}%" if termo else None

        # 1. Buscar Peças Prontas correspondentes
        pecas_query = PecaPronta.query.join(Brand)
        if brand_id:
            pecas_query = pecas_query.filter(PecaPronta.brand_id == brand_id)
        if cor and cor != "TODOS":
            pecas_query = pecas_query.filter(db.func.upper(PecaPronta.cor) == cor)
        if tipo and tipo != "TODOS":
            pecas_query = pecas_query.filter(db.func.upper(PecaPronta.tipo) == tipo)
        
        if termo_like:
            pecas_query = pecas_query.filter(
                (PecaPronta.sku.ilike(termo_like)) |
                (PecaPronta.codigo_estampa.ilike(termo_like)) |
                (PecaPronta.tipo.ilike(termo_like)) |
                (PecaPronta.cor.ilike(termo_like)) |
                (PecaPronta.tamanho.ilike(termo_like)) |
                (Brand.name.ilike(termo_like))
            )
        pecas_encontradas = pecas_query.all()

        # 2. Buscar Estampas Avulsas correspondentes
        estampas_query = Estampa.query.join(Brand)
        if brand_id:
            estampas_query = estampas_query.filter(Estampa.brand_id == brand_id)
        if cor and cor != "TODOS":
            estampas_query = estampas_query.filter(db.func.upper(Estampa.cor) == cor)

        if termo_like:
            estampas_query = estampas_query.filter(
                (Estampa.codigo_estampa.ilike(termo_like)) |
                (Estampa.nome_design.ilike(termo_like)) |
                (Estampa.cor.ilike(termo_like)) |
                (Brand.name.ilike(termo_like))
            )
        estampas_encontradas = estampas_query.all()

        # Se houver estampas por nome/código, buscar peças prontas associadas
        codigos_estampas = [e.codigo_estampa.upper() for e in estampas_encontradas]
        if codigos_estampas:
            pecas_rel = PecaPronta.query.filter(
                db.func.upper(PecaPronta.codigo_estampa).in_(codigos_estampas)
            )
            if brand_id:
                pecas_rel = pecas_rel.filter_by(brand_id=brand_id)
            for p in pecas_rel.all():
                if p not in pecas_encontradas:
                    pecas_encontradas.append(p)

        resultados_pecas = []
        for p in pecas_encontradas:
            est_assoc = Estampa.query.filter(db.func.upper(Estampa.codigo_estampa) == p.codigo_estampa.upper()).first()
            status_code = "PRONTO" if p.quantidade > 0 else "SEM_ESTOQUE"
            status_label = "Pronto para Envio" if p.quantidade > 0 else "Sem Estoque"
            badge_color = "emerald" if p.quantidade > 0 else "rose"

            resultados_pecas.append({
                "categoria": "peca",
                "id": p.id,
                "sku": p.sku,
                "tipo": p.tipo,
                "codigo_estampa": p.codigo_estampa,
                "nome_design": est_assoc.nome_design if est_assoc else "Peça Pronta",
                "cor": p.cor,
                "tamanho": p.tamanho,
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
                "sku": e.codigo_estampa,
                "codigo_estampa": e.codigo_estampa,
                "nome_design": e.nome_design,
                "cor": e.cor,
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
            qtd_usar = 1

        if not categoria or not item_id or qtd_usar <= 0:
            return jsonify({"erro": "Informe categoria ('peca' ou 'estampa'), ID do produto e quantidade válida."}), 400

        if categoria == "peca":
            peca = PecaPronta.query.get(item_id)
            if not peca:
                return jsonify({"erro": "Peça pronta não encontrada no estoque."}), 404
            if peca.quantidade < qtd_usar:
                return jsonify({"erro": f"Estoque insuficiente. Disponível: {peca.quantidade}, solicitado: {qtd_usar}"}), 400
            
            peca.quantidade -= qtd_usar
            db.session.commit()
            return jsonify({
                "mensagem": f"Sucesso! {qtd_usar} unidade(s) de '{peca.sku}' baixada(s) do estoque.",
                "item": peca.to_dict()
            }), 200

        elif categoria == "estampa":
            estampa = Estampa.query.get(item_id)
            if not estampa:
                return jsonify({"erro": "Estampa avulsa não encontrada no estoque."}), 404
            if estampa.quantidade < qtd_usar:
                return jsonify({"erro": f"Estoque insuficiente. Disponível: {estampa.quantidade}, solicitado: {qtd_usar}"}), 400
            
            estampa.quantidade -= qtd_usar
            db.session.commit()
            return jsonify({
                "mensagem": f"Sucesso! {qtd_usar} unidade(s) da estampa '{estampa.codigo_estampa}' baixada(s) do estoque.",
                "item": estampa.to_dict()
            }), 200

        return jsonify({"erro": "Categoria inválida para consumo."}), 400

    return app

def seed_initial_data():
    if not Brand.query.first():
        b1 = Brand(name="Clube Rock", slug="clube-rock", domain="https://www.cluberock.com.br/")
        b2 = Brand(name="Ride Nation", slug="ride-nation", domain="https://www.ridenation.com.br/")
        db.session.add_all([b1, b2])
        db.session.commit()

        # Seed Estampas para Clube Rock
        e1 = Estampa(codigo_estampa="001-PRE", nome_design="Caveira Rocker Classic", cor="PRE", quantidade=25, brand_id=b1.id)
        e2 = Estampa(codigo_estampa="002-BRA", nome_design="Vintage Guitar Solos", cor="BRA", quantidade=10, brand_id=b1.id)
        e3 = Estampa(codigo_estampa="003-AMA", nome_design="Psychedelic Wings", cor="AMA", quantidade=8, brand_id=b1.id)
        
        # Seed Estampas para Ride Nation
        e4 = Estampa(codigo_estampa="010-PRE", nome_design="Full Throttle Biker", cor="PRE", quantidade=15, brand_id=b2.id)
        e5 = Estampa(codigo_estampa="011-BRA", nome_design="Speed Customs 1978", cor="BRA", quantidade=4, brand_id=b2.id)
        db.session.add_all([e1, e2, e3, e4, e5])
        db.session.commit()

        # Seed Peças Prontas para Clube Rock
        p1 = PecaPronta(sku="CR-CM-001-PRE-M", tipo="CM", codigo_estampa="001-PRE", cor="PRE", tamanho="M", quantidade=4, brand_id=b1.id)
        p2 = PecaPronta(sku="CR-CM-001-PRE-G", tipo="CM", codigo_estampa="001-PRE", cor="PRE", tamanho="G", quantidade=0, brand_id=b1.id)
        p3 = PecaPronta(sku="CR-MO-002-BRA-L", tipo="MO", codigo_estampa="002-BRA", cor="BRA", tamanho="GG", quantidade=2, brand_id=b1.id)

        # Seed Peças Prontas para Ride Nation
        p4 = PecaPronta(sku="RN-CM-010-PRE-G", tipo="CM", codigo_estampa="010-PRE", cor="PRE", tamanho="G", quantidade=3, brand_id=b2.id)
        p5 = PecaPronta(sku="RN-CF-011-BRA-M", tipo="CF", codigo_estampa="011-BRA", cor="BRA", tamanho="M", quantidade=0, brand_id=b2.id)
        p6 = PecaPronta(sku="RN-MO-010-PRE-P", tipo="MO", codigo_estampa="010-PRE", cor="PRE", tamanho="P", quantidade=0, brand_id=b2.id)

        db.session.add_all([p1, p2, p3, p4, p5, p6])
        db.session.commit()

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
