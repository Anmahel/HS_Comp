import pytest
from sqlalchemy.exc import IntegrityError
from models import db, Brand, Cor, Design, SKU, Tamanho, Tipo, Estampa, PecaPronta

# -------------------------------------------------------------------
# PRUEBAS UNITARIAS / CAJA BLANCA: CATALOGOS (CRUD DIRECTO Y .to_dict())
# -------------------------------------------------------------------

def test_brand_model_crud_and_todict(db_session):
    """Verifica creación, lectura, actualización, eliminación y to_dict de Brand."""
    brand = Brand(name="Test Brand", slug="test-brand", domain="https://test.com")
    db_session.add(brand)
    db_session.commit()

    assert brand.id is not None
    assert brand.to_dict() == {
        "id": brand.id,
        "name": "Test Brand",
        "slug": "test-brand",
        "domain": "https://test.com"
    }

    # Update
    brand.name = "Test Brand Updated"
    db_session.commit()
    fetched = db_session.get(Brand, brand.id)
    assert fetched.name == "Test Brand Updated"

    # Delete
    db_session.delete(brand)
    db_session.commit()
    assert db_session.get(Brand, brand.id) is None


def test_cor_model_crud_and_todict(db_session):
    """Verifica CRUD y to_dict del modelo Cor."""
    cor = Cor(cor="VERDE")
    db_session.add(cor)
    db_session.commit()

    assert cor.id is not None
    assert cor.to_dict() == {"id": cor.id, "cor": "VERDE"}

    cor.cor = "VERDE_LIME"
    db_session.commit()
    assert db_session.get(Cor, cor.id).cor == "VERDE_LIME"

    db_session.delete(cor)
    db_session.commit()
    assert db_session.get(Cor, cor.id) is None


def test_design_model_crud_and_todict(db_session):
    """Verifica CRUD y to_dict del modelo Design."""
    design = Design(nome_design="Neon Cyberpunk")
    db_session.add(design)
    db_session.commit()

    assert design.id is not None
    d_dict = design.to_dict()
    assert d_dict["id"] == design.id
    assert d_dict["nome_design"] == "Neon Cyberpunk"

    design.nome_design = "Neon Cyberpunk 2077"
    db_session.commit()
    assert db_session.get(Design, design.id).nome_design == "Neon Cyberpunk 2077"

    db_session.delete(design)
    db_session.commit()
    assert db_session.get(Design, design.id) is None


def test_sku_model_crud_and_todict(db_session):
    """Verifica CRUD y to_dict del modelo SKU."""
    sku = SKU(sku="TB-CM-999-VER-L")
    db_session.add(sku)
    db_session.commit()

    assert sku.id is not None
    assert sku.to_dict() == {"id": sku.id, "sku": "TB-CM-999-VER-L"}

    sku.sku = "TB-CM-999-VER-XL"
    db_session.commit()
    assert db_session.get(SKU, sku.id).sku == "TB-CM-999-VER-XL"

    db_session.delete(sku)
    db_session.commit()
    assert db_session.get(SKU, sku.id) is None


def test_tamanho_model_crud_and_todict(db_session):
    """Verifica CRUD y to_dict del modelo Tamanho."""
    tamanho = Tamanho(tamanho="XG")
    db_session.add(tamanho)
    db_session.commit()

    assert tamanho.id is not None
    assert tamanho.to_dict() == {"id": tamanho.id, "tamanho": "XG"}

    tamanho.tamanho = "XXG"
    db_session.commit()
    assert db_session.get(Tamanho, tamanho.id).tamanho == "XXG"

    db_session.delete(tamanho)
    db_session.commit()
    assert db_session.get(Tamanho, tamanho.id) is None


def test_tipo_model_crud_and_todict(db_session):
    """Verifica CRUD y to_dict del modelo Tipo."""
    tipo = Tipo(codigo="JA", para="Jaqueta", genero="Masculino")
    db_session.add(tipo)
    db_session.commit()

    assert tipo.id is not None
    assert tipo.to_dict() == {
        "id": tipo.id,
        "codigo": "JA",
        "para": "Jaqueta",
        "genero": "Masculino"
    }

    tipo.para = "Jaqueta Jeans"
    db_session.commit()
    assert db_session.get(Tipo, tipo.id).para == "Jaqueta Jeans"

    db_session.delete(tipo)
    db_session.commit()
    assert db_session.get(Tipo, tipo.id) is None


# -------------------------------------------------------------------
# PRUEBAS UNITARIAS: INVENTARIOS (RELACIONES Y RESOLUCIÓN FK EN .to_dict())
# -------------------------------------------------------------------

def test_estampa_model_relations_and_todict(db_session, seed_catalog):
    """Verifica resolución de FK en Estampa.to_dict() y CRUD."""
    b = seed_catalog["brand"]
    c = seed_catalog["cor"]
    d = seed_catalog["design"]
    s = seed_catalog["sku"]

    estampa = Estampa(
        codigo_estampa=99,
        design_id=d.id,
        cor_id=c.id,
        quantidade=15,
        brand_id=b.id,
        sku_id=s.id
    )
    db_session.add(estampa)
    db_session.commit()

    as_dict = estampa.to_dict()
    assert as_dict["id"] == estampa.id
    assert as_dict["codigo_estampa"] == 99
    assert as_dict["design_id"] == d.id
    assert as_dict["nome_design"] == "Caveira Rocker Classic"
    assert as_dict["cor_id"] == c.id
    assert as_dict["cor"] == "PRE"
    assert as_dict["brand_id"] == b.id
    assert as_dict["brand_name"] == "Clube Rock"
    assert as_dict["sku"] == "CR-CM-001-PRE-M"
    assert as_dict["quantidade"] == 15
    assert "updated_at" in as_dict

    # Update
    estampa.quantidade = 30
    db_session.commit()
    assert db_session.get(Estampa, estampa.id).quantidade == 30

    # Delete
    db_session.delete(estampa)
    db_session.commit()
    assert db_session.get(Estampa, estampa.id) is None


def test_peca_pronta_model_relations_and_todict(db_session, seed_catalog):
    """Verifica resolución de FK en PecaPronta.to_dict() y relaciones directas."""
    b = seed_catalog["brand"]
    c = seed_catalog["cor"]
    d = seed_catalog["design"]
    s = seed_catalog["sku"]
    t = seed_catalog["tamanho"]
    tp = seed_catalog["tipo"]

    peca = PecaPronta(
        sku_id=s.id,
        tipo_id=tp.id,
        codigo_estampa=99,
        design_id=d.id,
        cor_id=c.id,
        tamanho_id=t.id,
        quantidade=12,
        brand_id=b.id
    )
    db_session.add(peca)
    db_session.commit()

    as_dict = peca.to_dict()
    assert as_dict["id"] == peca.id
    assert as_dict["sku_id"] == s.id
    assert as_dict["sku"] == "CR-CM-001-PRE-M"
    assert as_dict["tipo_codigo"] == "CM"
    assert as_dict["codigo_estampa"] is not None
    assert as_dict["design_id"] == d.id
    assert as_dict["nome_design"] == "Caveira Rocker Classic"
    assert as_dict["cor_id"] == c.id
    assert as_dict["cor"] == "PRE"
    assert as_dict["tamanho_id"] == t.id
    assert as_dict["tamanho"] == "M"
    assert as_dict["brand_id"] == b.id
    assert as_dict["brand_name"] == "Clube Rock"
    assert as_dict["quantidade"] == 12

    # Delete
    db_session.delete(peca)
    db_session.commit()
    assert db_session.get(PecaPronta, peca.id) is None


# -------------------------------------------------------------------
# PRUEBAS UNITARIAS / CAJA BLANCA: RESTRICCIONES DE INTEGRIDAD (CONSTRAINTS)
# -------------------------------------------------------------------

def test_brand_slug_unique_constraint(db_session):
    """Intenta insertar un registro duplicado en brands.slug y asegura IntegrityError."""
    b1 = Brand(name="Brand Uno", slug="dupe-slug", domain="https://uno.com")
    db_session.add(b1)
    db_session.commit()

    b2 = Brand(name="Brand Dos", slug="dupe-slug", domain="https://dos.com")
    db_session.add(b2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_estampa_unique_constraint_codigo_brand(db_session, seed_catalog):
    """Viola la restricción UniqueConstraint('codigo_estampa', 'brand_id') en estampas y asegura IntegrityError."""
    b = seed_catalog["brand"]
    c = seed_catalog["cor"]
    d = seed_catalog["design"]

    e1 = Estampa(codigo_estampa=500, design_id=d.id, cor_id=c.id, brand_id=b.id, quantidade=5)
    db_session.add(e1)
    db_session.commit()

    e2 = Estampa(codigo_estampa=500, design_id=d.id, cor_id=c.id, brand_id=b.id, quantidade=10)
    db_session.add(e2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_cor_unique_constraint(db_session):
    """Verifica restricción de unicidad en Cor.cor."""
    c1 = Cor(cor="VERMELHO")
    db_session.add(c1)
    db_session.commit()

    c2 = Cor(cor="VERMELHO")
    db_session.add(c2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_design_unique_constraint(db_session):
    """Verifica restricción de unicidad en Design.nome_design."""
    d1 = Design(nome_design="Design Unico")
    db_session.add(d1)
    db_session.commit()

    d2 = Design(nome_design="Design Unico")
    db_session.add(d2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_sku_unique_constraint(db_session):
    """Verifica restricción de unicidad en SKU.sku."""
    s1 = SKU(sku="SKU-UNICO-123")
    db_session.add(s1)
    db_session.commit()

    s2 = SKU(sku="SKU-UNICO-123")
    db_session.add(s2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()
