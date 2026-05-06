import { PrismaClient, Role, ConditionGrade } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Merma Marketplace (Licores México) ---');

  // 1. Create a Master Seller
  const passwordHash = await bcrypt.hash('merma123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@merma.mx' },
    update: {},
    create: {
      email: 'admin@merma.mx',
      password_hash: passwordHash,
      role: Role.ADMIN,
      kyc_status: 'VERIFIED',
    },
  });

  const seller = await prisma.seller.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      legal_name: 'Distribuidora Premium de México S.A.',
      rfc: 'DPM123456ABC',
      tax_regime: '601',
      verification_level: 'GOLD',
    },
  });

  // 2. Sample Liquor Products
  const liquors = [
    {
      sku: 'TEQ-DJ-70-750',
      title: 'Tequila Don Julio 70 Añejo Cristalino',
      description: 'Botella de 750ml. Empaque ligeramente maltratado por transporte. El sello de seguridad está intacto.',
      original_price: 1100,
      sale_price: 850,
      stock: 15,
      condition_grade: ConditionGrade.A,
      images: ['https://picsum.photos/seed/tequila-dj/800/800'],
    },
    {
      sku: 'TEQ-MD-MAESTRO-750',
      title: 'Tequila Maestro Dobel Diamante',
      description: 'Edición especial. Etiqueta con raspadura menor. Contenido íntegro.',
      original_price: 850,
      sale_price: 620,
      stock: 24,
      condition_grade: ConditionGrade.B,
      images: ['https://picsum.photos/seed/tequila-md/800/800'],
    },
    {
      sku: 'MEZ-400-CONEJOS',
      title: 'Mezcal 400 Conejos Espadín',
      description: 'Mezcal joven de Oaxaca. Sin caja original.',
      original_price: 550,
      sale_price: 390,
      stock: 50,
      condition_grade: ConditionGrade.A,
      images: ['https://picsum.photos/seed/mezcal-400/800/800'],
    },
    {
      sku: 'WHI-JW-BLACK-1L',
      title: 'Johnnie Walker Black Label 1L',
      description: 'Botella de litro. Caja de cartón abollada. Gran oportunidad.',
      original_price: 980,
      sale_price: 740,
      stock: 12,
      condition_grade: ConditionGrade.B,
      images: ['https://picsum.photos/seed/whisky-jw/800/800'],
    },
    {
      sku: 'GIN-HENDRICKS-750',
      title: "Ginebra Hendrick's Scottish Gin",
      description: 'Botella icónica. Sin defectos en botella, solo excedente de inventario.',
      original_price: 1050,
      sale_price: 820,
      stock: 8,
      condition_grade: ConditionGrade.A,
      images: ['https://picsum.photos/seed/gin-hendricks/800/800'],
    },
    {
      sku: 'TEQ-H-REPOSADO',
      title: 'Tequila Herradura Reposado 700ml',
      description: 'Clásico mexicano. Etiqueta descolorida por exhibición en vitrina.',
      original_price: 720,
      sale_price: 540,
      stock: 30,
      condition_grade: ConditionGrade.C,
      images: ['https://picsum.photos/seed/tequila-herradura/800/800'],
    }
  ];

  for (const item of liquors) {
    await prisma.product.upsert({
      where: { sku: item.sku },
      update: { images: item.images, sale_price: item.sale_price, stock: item.stock },
      create: {
        sellerId: seller.id,
        sku: item.sku,
        title: item.title,
        description: item.description,
        condition_grade: item.condition_grade,
        original_price: item.original_price,
        sale_price: item.sale_price,
        stock: item.stock,
        images: item.images,
      },
    });
  }

  console.log('✅ Seed completed: 1 Admin/Seller and 6 popular products created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
