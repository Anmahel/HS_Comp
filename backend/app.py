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
        if "cor" in data:
            peca.cor = data["cor"].strip().upper()
        if "tamanho" in data:
            peca.tamanho = data["tamanho"].strip().upper()
        if "brand_id" in data:
            peca.brand_id = int(data["brand_id"])

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
    @app.route("/api/verificar-disponibilidade", methods=["GET"])
    def verificar_disponibilidade():
        sku = request.args.get("sku", "").strip().upper()
        brand_id = request.args.get("brand_id", type=int)

        if not sku:
            return jsonify({"erro": "Informe o parámetro 'sku' para consulta."}), 400

        # Formato esperado do SKU: TIPO-NUM-COR-TAMANHO (ex: CM-001-PRE-M ou MO-002-BRA-P)
        partes = sku.split("-")
        
        peca_query = PecaPronta.query.filter_by(sku=sku)
        if brand_id:
            peca_query = peca_query.filter_by(brand_id=brand_id)
        peca = peca_query.first()

        peca_pronta_qtd = peca.quantidade if peca else 0

        # Tentar extrair código da estampa
        codigo_estampa = None
        if peca:
            codigo_estampa = peca.codigo_estampa
        elif len(partes) >= 3:
            # ex: CM-001-PRE-M -> NUM: 001, COR: PRE -> codigo_estampa: "001-PRE"
            codigo_estampa = f"{partes[1]}-{partes[2]}"

        estampa_qtd = 0
        nome_estampa = "Não encontrada"
        if codigo_estampa:
            estampa_query = Estampa.query.filter_by(codigo_estampa=codigo_estampa)
            if brand_id:
                estampa_query = estampa_query.filter_by(brand_id=brand_id)
            estampa = estampa_query.first()
            if estampa:
                estampa_qtd = estampa.quantidade
                nome_estampa = estampa.nome_design

        # Lógica de decisão dos badges
        if peca_pronta_qtd > 0:
            status_code = "PRONTO"
            status_label = "Pronto para Envio"
            badge_color = "emerald"
            mensagem = f"Existem {peca_pronta_qtd} unidade(s) da peça pronta no estoque para despacho imediato."
        elif estampa_qtd > 0:
            status_code = "ESTAMPAR"
            status_label = "Disponível para Estampar"
            badge_color = "amber"
            mensagem = f"Sem peça pronta, porém existem {estampa_qtd} unidade(s) da estampa avulsa ({codigo_estampa}) para montagem rápida."
        else:
            status_code = "SEM_ESTOQUE"
            status_label = "Sem Estoque"
            badge_color = "rose"
            mensagem = "Sem unidades da peça pronta e sem estampas avulsas disponíveis no momento."

        return jsonify({
            "sku": sku,
            "codigo_estampa": codigo_estampa,
            "nome_design_estampa": nome_estampa,
            "brand_id": peca.brand_id if peca else brand_id,
            "brand_name": peca.brand.name if peca and peca.brand else "Geral",
            "peca_pronta_qtd": peca_pronta_qtd,
            "estampa_qtd": estampa_qtd,
            "status_code": status_code,
            "status_label": status_label,
            "badge_color": badge_color,
            "mensagem": mensagem
        }), 200

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
        p1 = PecaPronta(sku="CM-001-PRE-M", tipo="CM", codigo_estampa="001-PRE", cor="PRE", tamanho="M", quantidade=4, brand_id=b1.id)
        p2 = PecaPronta(sku="CM-001-PRE-G", tipo="CM", codigo_estampa="001-PRE", cor="PRE", tamanho="G", quantidade=0, brand_id=b1.id)
        p3 = PecaPronta(sku="MO-002-BRA-L", tipo="MO", codigo_estampa="002-BRA", cor="BRA", tamanho="GG", quantidade=2, brand_id=b1.id)

        # Seed Peças Prontas para Ride Nation
        p4 = PecaPronta(sku="CM-010-PRE-G", tipo="CM", codigo_estampa="010-PRE", cor="PRE", tamanho="G", quantidade=3, brand_id=b2.id)
        p5 = PecaPronta(sku="CF-011-BRA-M", tipo="CF", codigo_estampa="011-BRA", cor="BRA", tamanho="M", quantidade=0, brand_id=b2.id)
        p6 = PecaPronta(sku="MO-010-PRE-P", tipo="MO", codigo_estampa="010-PRE", cor="PRE", tamanho="P", quantidade=0, brand_id=b2.id)

        db.session.add_all([p1, p2, p3, p4, p5, p6])
        db.session.commit()

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
