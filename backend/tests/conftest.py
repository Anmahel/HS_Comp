import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from models import db, Brand, Cor, Design, SKU, Tamanho, Tipo, Estampa, PecaPronta

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "test-secret-key"

@pytest.fixture(scope="function")
def app():
    """Fixture que levanta uma base de dados de testes SQLite em memória (:memory:)."""
    app = create_app(config_class=TestConfig)
    with app.app_context():
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope="function")
def client(app):
    """Fixture client para simular requisições HTTP aos endpoints da Flask API."""
    return app.test_client()

@pytest.fixture(scope="function")
def db_session(app):
    """Fixture de sessão direta do SQLAlchemy para testes unitários."""
    yield db.session

@pytest.fixture(scope="function")
def seed_catalog(db_session):
    """
    Fixture que fornece dados semilla catalogados pré-carregados
    para reutilização nos tests.
    """
    brand = Brand.query.filter_by(slug="clube-rock").first()
    cor = Cor.query.filter_by(cor="PRE").first()
    design = Design.query.filter_by(nome_design="Caveira Rocker Classic").first()
    sku = SKU.query.filter_by(sku="CR-CM-001-PRE-M").first()
    tamanho = Tamanho.query.filter_by(tamanho="M").first()
    tipo = Tipo.query.filter_by(codigo="CM").first()

    return {
        "brand": brand,
        "cor": cor,
        "design": design,
        "sku": sku,
        "tamanho": tamanho,
        "tipo": tipo
    }
