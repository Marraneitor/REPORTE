export interface Product {
  nombre: string;
  descripcion: string;
  categoria: string;
  precioVenta: number;
  costoProduccion: number;
  ingredientes: {
    id: string;
    nombre: string;
    unidad: string;
    cantidad: number;
  }[];
  disponible: boolean;
  imagen?: string;
}

export const PRODUCTS: Product[] = [
  {
    nombre: "Aros de cebolla 15pz",
    descripcion: "15 piezas de aros de cebolla con aderezo ranch",
    categoria: "Entradas",
    precioVenta: 80.00,
    costoProduccion: 48.50,
    ingredientes: [
      { id: "charola1", nombre: "CHAROLA UNISEL", unidad: "unidades", cantidad: 1 },
      { id: "papel1", nombre: "PAPEL GRADO ALIMENTICIO", unidad: "unidades", cantidad: 1 },
      { id: "aros1", nombre: "AROS DE CEBOLLA", unidad: "unidades", cantidad: 15 },
      { id: "ranch1", nombre: "Ranch", unidad: "ml", cantidad: 30 },
      { id: "bote1", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 }
    ],
    disponible: true
  },
  {
    nombre: "HAMBURGUESA",
    descripcion: "Hamburguesa tradicional con carne, vegetales y queso",
    categoria: "Hamburguesas",
    precioVenta: 100.00,
    costoProduccion: 52.10,
    ingredientes: [
      { id: "bimbollo1", nombre: "BIMBOLLO", unidad: "unidades", cantidad: 1 },
      { id: "mayo1", nombre: "MAYONESA", unidad: "g", cantidad: 10 },
      { id: "chiles1", nombre: "CHILES", unidad: "unidades", cantidad: 1 },
      { id: "bote2", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 },
      { id: "carne1", nombre: "CARNE DE HAMBURGUESA", unidad: "unidades", cantidad: 1 },
      { id: "tocino1", nombre: "TOCINO", unidad: "unidades", cantidad: 1 },
      { id: "veg1", nombre: "Vegetales", unidad: "unidades", cantidad: 1 },
      { id: "queso1", nombre: "QUESO AMERICANO", unidad: "unidades", cantidad: 1 },
      { id: "catsup1", nombre: "Catsup", unidad: "unidades", cantidad: 1 },
      { id: "queso2", nombre: "QUESO MANCHEGO", unidad: "g", cantidad: 30 },
      { id: "papel2", nombre: "PAPEL GRADO ALIMENTICIO", unidad: "unidades", cantidad: 1 },
      { id: "charola2", nombre: "CHAROLA UNISEL", unidad: "unidades", cantidad: 1 }
    ],
    disponible: true
  },
  {
    nombre: "HAMBURGUESA BBQ",
    descripcion: "Hamburguesa con salsa BBQ, tocino, queso y aros de cebolla",
    categoria: "Hamburguesas",
    precioVenta: 110.00,
    costoProduccion: 57.76,
    ingredientes: [
      { id: "bimbollo2", nombre: "BIMBOLLO", unidad: "unidades", cantidad: 1 },
      { id: "mayo2", nombre: "MAYONESA", unidad: "g", cantidad: 10 },
      { id: "chiles2", nombre: "CHILES", unidad: "unidades", cantidad: 1 },
      { id: "bote3", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 },
      { id: "carne2", nombre: "CARNE DE HAMBURGUESA", unidad: "unidades", cantidad: 1 },
      { id: "tocino2", nombre: "TOCINO", unidad: "unidades", cantidad: 1 },
      { id: "veg2", nombre: "Vegetales", unidad: "unidades", cantidad: 1 },
      { id: "queso3", nombre: "QUESO AMERICANO", unidad: "unidades", cantidad: 1 },
      { id: "aros2", nombre: "AROS DE CEBOLLA", unidad: "unidades", cantidad: 3 },
      { id: "bbq1", nombre: "SALSA BBQ", unidad: "g", cantidad: 30 },
      { id: "catsup2", nombre: "Catsup", unidad: "unidades", cantidad: 1 },
      { id: "papel3", nombre: "PAPEL GRADO ALIMENTICIO", unidad: "unidades", cantidad: 1 },
      { id: "charola3", nombre: "CHAROLA UNISEL", unidad: "unidades", cantidad: 1 }
    ],
    disponible: true
  },
  {
    nombre: "HAMBURGUESA BBQ DOBLE",
    descripcion: "Hamburguesa doble carne con salsa BBQ, tocino, queso y aros de cebolla",
    categoria: "Hamburguesas",
    precioVenta: 140.00,
    costoProduccion: 76.14,
    ingredientes: [
      { id: "bimbollo3", nombre: "BIMBOLLO", unidad: "unidades", cantidad: 1 },
      { id: "mayo3", nombre: "MAYONESA", unidad: "g", cantidad: 10 },
      { id: "chiles3", nombre: "CHILES", unidad: "unidades", cantidad: 1 },
      { id: "bote4", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 },
      { id: "carne3", nombre: "CARNE DE HAMBURGUESA", unidad: "unidades", cantidad: 2 },
      { id: "tocino3", nombre: "TOCINO", unidad: "unidades", cantidad: 1 },
      { id: "veg3", nombre: "Vegetales", unidad: "unidades", cantidad: 1 },
      { id: "queso4", nombre: "QUESO AMERICANO", unidad: "unidades", cantidad: 2 },
      { id: "aros3", nombre: "AROS DE CEBOLLA", unidad: "unidades", cantidad: 3 },
      { id: "bbq2", nombre: "SALSA BBQ", unidad: "g", cantidad: 30 },
      { id: "catsup3", nombre: "Catsup", unidad: "unidades", cantidad: 1 },
      { id: "papel4", nombre: "PAPEL GRADO ALIMENTICIO", unidad: "unidades", cantidad: 1 },
      { id: "charola4", nombre: "CHAROLA UNISEL", unidad: "unidades", cantidad: 1 }
    ],
    disponible: true
  },
  {
    nombre: "HAMBURGUESA DOBLE",
    descripcion: "Hamburguesa con doble carne, queso y tocino",
    categoria: "Hamburguesas",
    precioVenta: 130.00,
    costoProduccion: 65.98,
    ingredientes: [
      { id: "bimbollo4", nombre: "BIMBOLLO", unidad: "unidades", cantidad: 1 },
      { id: "mayo4", nombre: "MAYONESA", unidad: "g", cantidad: 10 },
      { id: "chiles4", nombre: "CHILES", unidad: "unidades", cantidad: 1 },
      { id: "bote5", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 },
      { id: "carne4", nombre: "CARNE DE HAMBURGUESA", unidad: "unidades", cantidad: 2 },
      { id: "tocino4", nombre: "TOCINO", unidad: "unidades", cantidad: 1 },
      { id: "veg4", nombre: "Vegetales", unidad: "unidades", cantidad: 1 },
      { id: "queso5", nombre: "QUESO AMERICANO", unidad: "unidades", cantidad: 2 },
      { id: "catsup4", nombre: "Catsup", unidad: "unidades", cantidad: 1 },
      { id: "papel5", nombre: "PAPEL GRADO ALIMENTICIO", unidad: "unidades", cantidad: 1 },
      { id: "charola5", nombre: "CHAROLA UNISEL", unidad: "unidades", cantidad: 1 }
    ],
    disponible: true
  },
  {
    nombre: "HOTDOG",
    descripcion: "Hot dog tradicional con salchicha jumbo, vegetales y tocino",
    categoria: "Hot Dogs",
    precioVenta: 60.00,
    costoProduccion: 31.05,
    ingredientes: [
      { id: "tocino5", nombre: "TOCINO", unidad: "unidades", cantidad: 1 },
      { id: "mayo5", nombre: "MAYONESA", unidad: "g", cantidad: 1 },
      { id: "charola6", nombre: "CHAROLA UNISEL", unidad: "unidades", cantidad: 1 },
      { id: "papel6", nombre: "PAPEL GRADO ALIMENTICIO", unidad: "unidades", cantidad: 1 },
      { id: "chiles5", nombre: "CHILES", unidad: "unidades", cantidad: 1 },
      { id: "bote6", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 },
      { id: "vegH", nombre: "Vegetales Hotdog", unidad: "unidades", cantidad: 1 },
      { id: "catsup5", nombre: "Catsup", unidad: "unidades", cantidad: 1 },
      { id: "pan1", nombre: "PAN HOTDOG", unidad: "unidades", cantidad: 1 },
      { id: "salchicha1", nombre: "SALCHICHAS JUMBO", unidad: "unidades", cantidad: 1 }
    ],
    disponible: true
  },
  {
    nombre: "Papas Gajo chicas",
    descripcion: "Porción chica de papas gajo con queso para nachos",
    categoria: "Complementos",
    precioVenta: 20.00,
    costoProduccion: 13.99,
    ingredientes: [
      { id: "queso6", nombre: "QUESO NACHOS", unidad: "g", cantidad: 35 },
      { id: "bote7", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 },
      { id: "papas1", nombre: "PAPAS GAJO", unidad: "g", cantidad: 140 }
    ],
    disponible: true
  },
  {
    nombre: "Papas Gajo Medianas",
    descripcion: "Porción mediana de papas gajo con queso para nachos",
    categoria: "Complementos",
    precioVenta: 60.00,
    costoProduccion: 28.89,
    ingredientes: [
      { id: "queso7", nombre: "QUESO NACHOS", unidad: "g", cantidad: 35 },
      { id: "bote8", nombre: "BOTECITO", unidad: "unidades", cantidad: 1 },
      { id: "papas2", nombre: "PAPAS GAJO", unidad: "g", cantidad: 280 },
      { id: "papel7", nombre: "PAPEL GRADO ALIMENTICIO", unidad: "unidades", cantidad: 1 }
    ],
    disponible: true
  }
];
