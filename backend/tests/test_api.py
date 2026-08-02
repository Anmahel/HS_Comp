import json
import pytest

# -------------------------------------------------------------------
# 1. HEALTH CHECK & GENERAL
# -------------------------------------------------------------------

def test_health_check(client):
    """Verifica que el endpoint de salud devuelva 200 y el formato esperado."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "online"
    assert "servico" in data


# -------------------------------------------------------------------
# 2. CRUD DE CATALOGOS (BRANDS, CORES, DESIGNS, SKUS, TAMANHOS, TIPOS)
# -------------------------------------------------------------------

def test_brands_crud(client):
    """Prueba HTTP completa (GET, POST, GET by ID, PUT, DELETE) para Brands."""
    # 1. GET ALL
    resp = client.get("/api/brands")
    assert resp.status_code == 200
    brands = resp.get_json()
    assert isinstance(brands, list)
    assert len(brands) >= 2

    # 2. POST (Create)
    payload = {"name": "Nueva Marca", "slug": "nueva-marca", "domain": "https://nuevamarca.com"}
    resp = client.post("/api/brands", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 201
    created = resp.get_json()
    brand_id = created["id"]
    assert created["slug"] == "nueva-marca"

    # 3. GET BY ID
    resp = client.get(f"/api/brands/{brand_id}")
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "Nueva Marca"

    # 4. PUT (Update)
    update_payload = {"name": "Marca Actualizada"}
    resp = client.put(f"/api/brands/{brand_id}", data=json.dumps(update_payload), content_type="application/json")
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "Marca Actualizada"

    # 5. DELETE
    resp = client.delete(f"/api/brands/{brand_id}")
    assert resp.status_code == 200

    # Verify deleted
    resp = client.get(f"/api/brands/{brand_id}")
    assert resp.status_code == 404


def test_cores_crud(client):
    """Prueba HTTP completa (GET, POST, GET by ID, PUT, DELETE) para Cores."""
    # GET
    resp = client.get("/api/cores")
    assert resp.status_code == 200
    assert len(resp.get_json()) >= 3

    # POST
    resp = client.post("/api/cores", data=json.dumps({"cor": "AZU"}), content_type="application/json")
    assert resp.status_code == 201
    cor_id = resp.get_json()["id"]
    assert resp.get_json()["cor"] == "AZU"

    # GET BY ID
    resp = client.get(f"/api/cores/{cor_id}")
    assert resp.status_code == 200
    assert resp.get_json()["cor"] == "AZU"

    # PUT
    resp = client.put(f"/api/cores/{cor_id}", data=json.dumps({"cor": "AZUL"}), content_type="application/json")
    assert resp.status_code == 200
    assert resp.get_json()["cor"] == "AZUL"

    # DELETE
    resp = client.delete(f"/api/cores/{cor_id}")
    assert resp.status_code == 200
    assert client.get(f"/api/cores/{cor_id}").status_code == 404


def test_designs_crud(client):
    """Prueba HTTP completa (GET, POST, GET by ID, PUT, DELETE) para Designs."""
    resp = client.get("/api/designs")
    assert resp.status_code == 200

    resp = client.post("/api/designs", data=json.dumps({"nome_design": "Skull Fire"}), content_type="application/json")
    assert resp.status_code == 201
    design_id = resp.get_json()["id"]

    resp = client.get(f"/api/designs/{design_id}")
    assert resp.status_code == 200

    resp = client.put(f"/api/designs/{design_id}", data=json.dumps({"nome_design": "Skull Fire Red"}), content_type="application/json")
    assert resp.status_code == 200
    assert resp.get_json()["nome_design"] == "Skull Fire Red"

    resp = client.delete(f"/api/designs/{design_id}")
    assert resp.status_code == 200


def test_skus_crud(client):
    """Prueba HTTP completa (GET, POST, GET by ID, PUT, DELETE) para SKUs."""
    resp = client.get("/api/skus")
    assert resp.status_code == 200

    resp = client.post("/api/skus", data=json.dumps({"sku": "TEST-SKU-001"}), content_type="application/json")
    assert resp.status_code == 201
    sku_id = resp.get_json()["id"]

    resp = client.get(f"/api/skus/{sku_id}")
    assert resp.status_code == 200

    resp = client.put(f"/api/skus/{sku_id}", data=json.dumps({"sku": "TEST-SKU-002"}), content_type="application/json")
    assert resp.status_code == 200

    resp = client.delete(f"/api/skus/{sku_id}")
    assert resp.status_code == 200


def test_tamanhos_crud(client):
    """Prueba HTTP completa para Tamanhos."""
    resp = client.get("/api/tamanhos")
    assert resp.status_code == 200

    resp = client.post("/api/tamanhos", data=json.dumps({"tamanho": "XXL"}), content_type="application/json")
    assert resp.status_code == 201
    tamanho_id = resp.get_json()["id"]

    resp = client.get(f"/api/tamanhos/{tamanho_id}")
    assert resp.status_code == 200

    resp = client.put(f"/api/tamanhos/{tamanho_id}", data=json.dumps({"tamanho": "3XL"}), content_type="application/json")
    assert resp.status_code == 200

    resp = client.delete(f"/api/tamanhos/{tamanho_id}")
    assert resp.status_code == 200


def test_tipos_crud(client):
    """Prueba HTTP completa para Tipos."""
    resp = client.get("/api/tipos")
    assert resp.status_code == 200

    payload = {"codigo": "BL", "para": "Blusa", "genero": "Feminino"}
    resp = client.post("/api/tipos", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 201
    tipo_id = resp.get_json()["id"]

    resp = client.get(f"/api/tipos/{tipo_id}")
    assert resp.status_code == 200

    resp = client.put(f"/api/tipos/{tipo_id}", data=json.dumps({"para": "Blusão"}), content_type="application/json")
    assert resp.status_code == 200
    assert resp.get_json()["para"] == "Blusão"

    resp = client.delete(f"/api/tipos/{tipo_id}")
    assert resp.status_code == 200


# -------------------------------------------------------------------
# 3. CRUD DE INVENTARIOS (ESTAMPAS Y PEÇAS PRONTAS)
# -------------------------------------------------------------------

def test_estampas_crud(client):
    """Prueba HTTP completa para Estampas."""
    # GET
    resp = client.get("/api/estampas")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)

    # POST (Create)
    payload = {
        "codigo_estampa": 50,
        "design_id": 1,
        "cor_id": 1,
        "brand_id": 1,
        "quantidade": 18
    }
    resp = client.post("/api/estampas", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 201
    created = resp.get_json()
    estampa_id = created["id"]
    assert created["codigo_estampa"] == 50
    assert created["nome_design"] == "Caveira Rocker Classic"

    # GET BY ID
    resp = client.get(f"/api/estampas/{estampa_id}")
    assert resp.status_code == 200

    # PUT
    resp = client.put(f"/api/estampas/{estampa_id}", data=json.dumps({"quantidade": 35}), content_type="application/json")
    assert resp.status_code == 200
    assert resp.get_json()["quantidade"] == 35

    # DELETE
    resp = client.delete(f"/api/estampas/{estampa_id}")
    assert resp.status_code == 200
    assert client.get(f"/api/estampas/{estampa_id}").status_code == 404


def test_pecas_prontas_crud(client):
    """Prueba HTTP completa para Peças Prontas com funcionalidade de Upsert."""
    resp = client.get("/api/pecas-prontas")
    assert resp.status_code == 200

    payload = {
        "sku": "CR-CM-999-PRE-M",
        "tipo": "CM",
        "codigo_estampa": 999,
        "design_id": 1,
        "cor": "PRE",
        "tamanho": "M",
        "brand_id": 1,
        "quantidade": 10
    }
    resp = client.post("/api/pecas-prontas", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code in (200, 201)
    peca_id = resp.get_json()["id"]

    resp = client.get(f"/api/pecas-prontas/{peca_id}")
    assert resp.status_code == 200

    resp = client.put(f"/api/pecas-prontas/{peca_id}", data=json.dumps({"quantidade": 25}), content_type="application/json")
    assert resp.status_code == 200
    assert resp.get_json()["quantidade"] == 25

    resp = client.delete(f"/api/pecas-prontas/{peca_id}")
    assert resp.status_code == 200
    assert client.get(f"/api/pecas-prontas/{peca_id}").status_code == 404

def test_create_estampa_duplicate_upsert(client):
    """Envía combinación existente (codigo_estampa, brand_id) y espera 200 OK sumando quantidade (Upsert)."""
    payload = {
        "codigo_estampa": 1,
        "design_id": 1,
        "cor_id": 1,
        "brand_id": 1,
        "quantidade": 10
    }
    resp = client.post("/api/estampas", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 200
    assert resp.get_json()["quantidade"] >= 10


# -------------------------------------------------------------------
# 4. ENDPOINTS DE LÓGICA DE NEGOCIO (DISPONIBILIDAD Y CONSUMO)
# -------------------------------------------------------------------

def test_verificar_disponibilidade(client):
    """Prueba filtro de disponibilidad por prefijo, color y término de búsqueda."""
    resp = client.get("/api/verificar-disponibilidade?sku=001&brand_prefix=CR&cor=PRE&tipo=CM")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "pecas" in data
    assert "estampas" in data
    assert data["total_encontrados"] >= 1

def test_verificar_disponibilidade_empty(client):
    """Prueba consulta sin resultados."""
    resp = client.get("/api/verificar-disponibilidade?sku=99999_NONEXISTENT")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total_encontrados"] == 0
    assert data["pecas"] == []
    assert data["estampas"] == []

def test_usar_estoque_peca_success(client):
    """Prueba consumo exitoso de stock de peça pronta."""
    payload = {"categoria": "peca", "id": 1, "quantidade": 2}
    resp = client.post("/api/usar-estoque", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "mensagem" in data
    assert data["item"]["quantidade"] == 2  # De 4 inicial a 2 restante

def test_usar_estoque_estampa_success(client):
    """Prueba consumo exitoso de stock de estampa."""
    payload = {"categoria": "estampa", "id": 1, "quantidade": 5}
    resp = client.post("/api/usar-estoque", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["item"]["quantidade"] == 20  # De 25 inicial a 20 restante

def test_usar_estoque_insufficient(client):
    """Prueba consumir más stock del disponible (error 400)."""
    payload = {"categoria": "peca", "id": 1, "quantidade": 9999}
    resp = client.post("/api/usar-estoque", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 400
    assert "erro" in resp.get_json()


# -------------------------------------------------------------------
# 5. VALIDACIONES DE ENTRADA / CAJA NEGRA & ERRORES HTTP (400, 404, 500 PREVENTION)
# -------------------------------------------------------------------

def test_create_brand_missing_fields(client):
    """Envía payload incompleto a Brands y espera 400 Bad Request."""
    resp = client.post("/api/brands", data=json.dumps({"name": "Solamente Nombre"}), content_type="application/json")
    assert resp.status_code == 400
    assert "erro" in resp.get_json()

def test_create_brand_duplicate_slug(client):
    """Intenta crear marca con slug duplicado vía API y espera 400 Bad Request."""
    payload = {"name": "Clube Rock Repetido", "slug": "clube-rock", "domain": "https://dupe.com"}
    resp = client.post("/api/brands", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 400
    assert "erro" in resp.get_json()

def test_create_estampa_non_existent_fk(client):
    """Envía brand_id: 9999 a estampas y espera 404 Not Found."""
    payload = {
        "codigo_estampa": 99,
        "design_id": 1,
        "cor_id": 1,
        "brand_id": 9999,
        "quantidade": 5
    }
    resp = client.post("/api/estampas", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 404
    assert "erro" in resp.get_json()



def test_usar_estoque_non_existent_item(client):
    """Solicita consumo de ID inexistente y espera 404 Not Found."""
    payload = {"categoria": "peca", "id": 9999, "quantidade": 1}
    resp = client.post("/api/usar-estoque", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 404
    assert "erro" in resp.get_json()

def test_usar_estoque_invalid_category(client):
    """Envía categoría inválida y espera 400 Bad Request."""
    payload = {"categoria": "invalido", "id": 1, "quantidade": 1}
    resp = client.post("/api/usar-estoque", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 400

def test_get_non_existent_catalog_id(client):
    """Consulta GET para un ID inexistente en marcas/cores/designs/etc y espera 404."""
    assert client.get("/api/brands/9999").status_code == 404
    assert client.get("/api/cores/9999").status_code == 404
    assert client.get("/api/designs/9999").status_code == 404
    assert client.get("/api/skus/9999").status_code == 404
    assert client.get("/api/tamanhos/9999").status_code == 404
    assert client.get("/api/tipos/9999").status_code == 404


# -------------------------------------------------------------------
# 6. CASOS BORDE (EDGE CASES)
# -------------------------------------------------------------------

def test_negative_quantity_estampa(client):
    """Intenta crear estampa con quantidade = -5 y espera 400 Bad Request."""
    payload = {
        "codigo_estampa": 88,
        "design_id": 1,
        "cor_id": 1,
        "brand_id": 1,
        "quantidade": -5
    }
    resp = client.post("/api/estampas", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 400
    assert "quantidade não pode ser negativa" in resp.get_json()["erro"]

def test_negative_quantity_peca_pronta(client):
    """Intenta crear peça pronta con quantidade = -10 y espera 400 Bad Request."""
    payload = {
        "sku_id": 1,
        "tipo_id": 1,
        "codigo_estampa": 1,
        "design_id": 1,
        "cor_id": 1,
        "tamanho_id": 1,
        "brand_id": 1,
        "quantidade": -10
    }
    resp = client.post("/api/pecas-prontas", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 400
    assert "quantidade não pode ser negativa" in resp.get_json()["erro"]

def test_update_negative_quantity(client):
    """Intenta actualizar quantidade = -20 en PUT y espera 400 Bad Request."""
    resp = client.put("/api/estampas/1", data=json.dumps({"quantidade": -20}), content_type="application/json")
    assert resp.status_code == 400

    resp = client.put("/api/pecas-prontas/1", data=json.dumps({"quantidade": -20}), content_type="application/json")
    assert resp.status_code == 400

def test_empty_string_payload(client):
    """Envía cadenas vacías en campos requeridos y espera 400 Bad Request."""
    payload = {"cor": "   "}
    resp = client.post("/api/cores", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 400

def test_special_characters_search_and_create(client):
    """Prueba el manejo de caracteres especiales y acentos en búsquedas y nombres."""
    # Create design with special chars
    resp = client.post("/api/designs", data=json.dumps({"nome_design": "Caveira & Rosas! @#$ 100%"}), content_type="application/json")
    assert resp.status_code == 201

    # Search with special characters
    resp = client.get("/api/verificar-disponibilidade?sku=Caveira%20%26")
    assert resp.status_code == 200
