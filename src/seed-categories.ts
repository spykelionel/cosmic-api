import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  try {
    console.log('🌱 Starting category seeding...');

    const defaultCategories = [
      {
        name: 'Smartphones',
        description: 'Mobile phones and smartphones with advanced features',
        image:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      },
      {
        name: 'Laptops & Computers',
        description: 'Desktop computers, laptops, and computing devices',
        image:
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      },
      {
        name: 'Smartwatches',
        description: 'Wearable technology and smartwatches',
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      },
      {
        name: 'Cameras & Photography',
        description: 'Digital cameras, lenses, and photography equipment',
        image:
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
      },
      {
        name: 'Audio & Headphones',
        description: 'Headphones, speakers, and audio equipment',
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      },
      {
        name: 'Gaming & Consoles',
        description: 'Gaming consoles, accessories, and gaming equipment',
        image:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
      },
      {
        name: 'Tablets & E-readers',
        description: 'Tablets, e-readers, and portable computing devices',
        image:
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      },
      {
        name: 'Home & Smart Devices',
        description: 'Smart home devices, IoT products, and home automation',
        image:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      },
      {
        name: 'Accessories & Peripherals',
        description: 'Computer accessories, cables, and peripheral devices',
        image:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
      },
      {
        name: 'Wearable Technology',
        description: 'Fitness trackers, VR headsets, and wearable devices',
        image:
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const categoryData of defaultCategories) {
      try {
        const category = await prisma.category.upsert({
          where: { name: categoryData.name },
          update: {},
          create: categoryData,
        });

        if (category.createdAt.getTime() === category.updatedAt.getTime()) {
          createdCount++;
          console.log(`✅ Created: ${category.name}`);
        } else {
          skippedCount++;
          console.log(`⏭️  Skipped (already exists): ${category.name}`);
        }
      } catch (error) {
        console.error(
          `❌ Error creating category ${categoryData.name}:`,
          error.message,
        );
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`📊 Created: ${createdCount} categories`);
    console.log(`⏭️  Skipped: ${skippedCount} categories`);
    console.log(`📈 Total: ${createdCount + skippedCount} categories`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedCategories();
