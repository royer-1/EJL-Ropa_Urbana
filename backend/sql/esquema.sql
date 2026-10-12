USE ejl_catalog;

CREATE TABLE categorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  orden INT NOT NULL DEFAULT 0,
  activa TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE etiquetas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT UNSIGNED NOT NULL,
  etiqueta_id INT UNSIGNED NULL,
  publico ENUM('mujer', 'hombre', 'ninos') NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  descripcion TEXT NULL,
  material VARCHAR(150) NULL,
  precio DECIMAL(12,2) NOT NULL,
  precio_anterior DECIMAL(12,2) NULL,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
  FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE SET NULL
);

CREATE TABLE colores_producto (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producto_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  codigo_hex CHAR(7) NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE imagenes_producto (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  color_id INT UNSIGNED NOT NULL,
  url VARCHAR(255) NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  FOREIGN KEY (color_id) REFERENCES colores_producto(id) ON DELETE CASCADE
);

CREATE TABLE variantes_producto (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producto_id INT UNSIGNED NOT NULL,
  color_id INT UNSIGNED NOT NULL,
  talle VARCHAR(10) NOT NULL,
  agotado TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE (color_id, talle),
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (color_id) REFERENCES colores_producto(id) ON DELETE CASCADE
);

CREATE TABLE usuarios_admin (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categorias (nombre, slug, orden) VALUES
  ('Remeras', 'remeras', 1),
  ('Buzos', 'buzos', 2),
  ('Camperas', 'camperas', 3),
  ('Pantalones', 'pantalones', 4);

INSERT INTO etiquetas (nombre) VALUES
  ('Nuevo'), ('Más vendido'), ('Edición limitada'),
  ('Esencial'), ('Favorito'), ('Comodidad');

INSERT INTO productos
  (categoria_id, etiqueta_id, publico, nombre, slug, descripcion, material, precio, precio_anterior)
VALUES
  (2, 1, 'mujer', 'Buzo Oversize Aura', 'buzo-oversize-aura',
   'Buzo oversize con hombro caído y textura suave.',
   'Algodón perchado de alto gramaje', 149000.00, 179000.00);

INSERT INTO colores_producto (producto_id, nombre, codigo_hex, orden) VALUES
  (1, 'Azul', '#5B7399', 1),
  (1, 'Crudo', '#EDE9E0', 2);

INSERT INTO imagenes_producto (color_id, url, orden) VALUES
  (1, '/uploads/ejemplo-azul-1.webp', 1),
  (1, '/uploads/ejemplo-azul-2.webp', 2),
  (2, '/uploads/ejemplo-crudo-1.webp', 1);

INSERT INTO variantes_producto (producto_id, color_id, talle, agotado) VALUES
  (1, 1, 'XS', 0), (1, 1, 'S', 0), (1, 1, 'M', 0), (1, 1, 'L', 1),
  (1, 2, 'S', 0), (1, 2, 'M', 0);