from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

# --------------------------------------------------------
# 1. TABLAS DE CATÁLOGO / MAESTRAS
# --------------------------------------------------------

class Brand(db.Model):
    __tablename__ = 'brands'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(50), nullable=False, unique=True)
    domain = db.Column(db.String(255), nullable=False)

    # Relaciones hacia las tablas operativas
    estampas = db.relationship('Estampa', backref='brand', lazy=True, cascade="all, delete-orphan")
    pecas_prontas = db.relationship('PecaPronta', backref='brand', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "domain": self.domain
        }


class Cor(db.Model):
    __tablename__ = 'cores'
    
    id = db.Column(db.Integer, primary_key=True)
    cor = db.Column(db.String(50), nullable=False, unique=True)

    def to_dict(self):
        return {"id": self.id, "cor": self.cor}


class Design(db.Model):
    __tablename__ = 'designs'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_design = db.Column(db.String(50), nullable=False, unique=True)
    codigo_estampa = db.Column('Cod_Estampa', db.String(10), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nome_design": self.nome_design,
            "codigo_estampa": str(self.codigo_estampa) if self.codigo_estampa is not None else None,
            "Cod_Estampa": str(self.codigo_estampa) if self.codigo_estampa is not None else None
        }


class SKU(db.Model):
    __tablename__ = 'skus'
    
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), nullable=False, unique=True)

    def to_dict(self):
        return {"id": self.id, "sku": self.sku}


class Tamanho(db.Model):
    __tablename__ = 'tamanhos'
    
    id = db.Column(db.Integer, primary_key=True)
    tamanho = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {"id": self.id, "tamanho": self.tamanho}


class Tipo(db.Model):
    __tablename__ = 'tipos'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(10))
    para = db.Column(db.String(25))
    genero = db.Column(db.String(25))

    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "para": self.para,
            "genero": self.genero
        }


# --------------------------------------------------------
# 2. TABLAS PRINCIPALES (INVENTARIO Y MOVIMIENTOS)
# --------------------------------------------------------

class Estampa(db.Model):
    __tablename__ = 'estampas'
    __table_args__ = (
        db.UniqueConstraint('codigo_estampa', 'brand_id', name='uq_estampa_brand'),
    )
    
    id = db.Column(db.Integer, primary_key=True)
    codigo_estampa = db.Column(db.Integer, nullable=False, default=0, index=True)
    design_id = db.Column(db.Integer, db.ForeignKey('designs.id'), nullable=False)
    cor_id = db.Column(db.Integer, db.ForeignKey('cores.id'), nullable=False)
    quantidade = db.Column(db.Integer, default=0, nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=False)
    sku_id = db.Column(db.Integer, db.ForeignKey('skus.id'), nullable=True)
    
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relaciones para acceder fácilmente a los textos desde Python
    design = db.relationship('Design', backref='estampas', lazy=True)
    cor_rel = db.relationship('Cor', backref='estampas', lazy=True)
    sku_rel = db.relationship('SKU', backref='estampas', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "codigo_estampa": self.codigo_estampa,
            "design_id": self.design_id,
            "nome_design": self.design.nome_design if self.design else None,
            "cor_id": self.cor_id,
            "cor": self.cor_rel.cor if self.cor_rel else None,
            "quantidade": self.quantidade,
            "brand_id": self.brand_id,
            "brand_name": self.brand.name if self.brand else None,
            "sku": self.sku_rel.sku if self.sku_rel else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class PecaPronta(db.Model):
    __tablename__ = 'pecas_prontas'
    
    id = db.Column(db.Integer, primary_key=True)
    sku_id = db.Column(db.Integer, db.ForeignKey('skus.id'), nullable=False)
    tipo_id = db.Column(db.Integer, db.ForeignKey('tipos.id'), nullable=False)
    design_id = db.Column(db.Integer, db.ForeignKey('designs.id'), nullable=False)
    cor_id = db.Column(db.Integer, db.ForeignKey('cores.id'), nullable=False)
    tamanho_id = db.Column(db.Integer, db.ForeignKey('tamanhos.id'), nullable=False)
    quantidade = db.Column(db.Integer, default=0, nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=False)
    
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relaciones relacionales directas
    sku_rel = db.relationship('SKU', backref='pecas_prontas', lazy=True)
    tipo_rel = db.relationship('Tipo', backref='pecas_prontas', lazy=True)
    design = db.relationship('Design', backref='pecas_prontas', lazy=True)
    cor_rel = db.relationship('Cor', backref='pecas_prontas', lazy=True)
    tamanho_rel = db.relationship('Tamanho', backref='pecas_prontas', lazy=True)

    @property
    def codigo_estampa(self):
        if self.design and self.design.codigo_estampa:
            try:
                return int(self.design.codigo_estampa)
            except (ValueError, TypeError):
                return self.design.codigo_estampa
        return 0

    @codigo_estampa.setter
    def codigo_estampa(self, value):
        pass

    def to_dict(self):
        return {
            "id": self.id,
            "sku_id": self.sku_id,
            "sku": self.sku_rel.sku if self.sku_rel else None,
            "tipo_codigo": self.tipo_rel.codigo if self.tipo_rel else None,
            "tipo": self.tipo_rel.codigo if self.tipo_rel else None,
            "codigo_estampa": self.codigo_estampa,
            "design_id": self.design_id,
            "nome_design": self.design.nome_design if self.design else None,
            "cor_id": self.cor_id,
            "cor": self.cor_rel.cor if self.cor_rel else None,
            "tamanho_id": self.tamanho_id,
            "tamanho": self.tamanho_rel.tamanho if self.tamanho_rel else None,
            "quantidade": self.quantidade,
            "brand_id": self.brand_id,
            "brand_name": self.brand.name if self.brand else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }