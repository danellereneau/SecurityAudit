import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default categories
  const defaultCategories = [
    { name: 'Entertainment', icon: '🎬', color: '#E91E63' },
    { name: 'Productivity', icon: '💼', color: '#2196F3' },
    { name: 'Utilities', icon: '⚡', color: '#FF9800' },
    { name: 'Cloud Storage', icon: '☁️', color: '#9C27B0' },
    { name: 'Security', icon: '🔒', color: '#F44336' },
    { name: 'Gaming', icon: '🎮', color: '#4CAF50' },
    { name: 'Education', icon: '📚', color: '#00BCD4' },
    { name: 'Health & Fitness', icon: '💪', color: '#8BC34A' },
    { name: 'News & Magazines', icon: '📰', color: '#607D8B' },
    { name: 'Music & Audio', icon: '🎵', color: '#FF5722' },
    { name: 'Other', icon: '📦', color: '#9E9E9E' },
  ];

  console.log('📂 Creating default categories...');

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        // Using a composite unique constraint - we'll need to update this
        // For now, just create if doesn't exist with this name
        id: category.name.toLowerCase().replace(/\s+/g, '-') + '-default'
      },
      update: {},
      create: {
        ...category,
        isDefault: true,
        userId: null, // System categories have no user
      },
    });
    console.log(`  ✅ Created category: ${category.name}`);
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
