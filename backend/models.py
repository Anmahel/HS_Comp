from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class Brand(db.Model):
    __tablename__ = 'brands'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(50), nullable=False, unique=True)
    domain = db.Column(db.String(255), nullable=False)

    estampas = db.relationship('Estampa', backref='brand', lazy=True, cascade="all, delete-orphan")
    pecas_prontas = db.relationship('PecaPronta', backref='brand', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "domain": self.domain
        }

class Estampa(db.Model):
    __tablename__ = 'estampas'
    __table_args__ = (
        # Evita duplicar el código de estampa dentro de la misma marca
        db.UniqueConstraint('codigo_estampa', 'brand_id', name='uq_estampa_brand'),
    )
    
    id = db.Column(db.Integer, primary_key=True)
    codigo_estampa = db.Column(db.String(20), nullable=False, index=True) # Ex: "001-PRE"
    nome_design = db.Column(db.String(150), nullable=False)               # Ex: "Caveira Rocker"
    cor = db.Column(db.String(10), nullable=False)                         # PRE, BRA, AMA
    quantidade = db.Column(db.Integer, default=0, nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "codigo_estampa": self.codigo_estampa,
            "nome_design": self.nome_design,
            "cor": self.cor,
            "quantidade": self.quantidade,
            "brand_id": self.brand_id,
            "brand_name": self.brand.name if self.brand else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class PecaPronta(db.Model):
    __tablename__ = 'pecas_prontas'
    
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), nullable=False, unique=True, index=True) # Ex: "CM-001-PRE-M"
    tipo = db.Column(db.String(10), nullable=False)                         # CM, CF, MO
    codigo_estampa = db.Column(db.String(20), nullable=False, index=True) # Ex: "001-PRE"
    cor = db.Column(db.String(10), nullable=False)                         # PRE, BRA, AMA
    tamanho = db.Column(db.String(10), nullable=False)                     # P, M, G, GG, G1, G2, G3, G4
    quantidade = db.Column(db.Integer, default=0, nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "sku": self.sku,
            "tipo": self.tipo,
            "codigo_estampa": self.codigo_estampa,
            "cor": self.cor,
            "tamanho": self.tamanho,
            "quantidade": self.quantidade,
            "brand_id": self.brand_id,
            "brand_name": self.brand.name if self.brand else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }