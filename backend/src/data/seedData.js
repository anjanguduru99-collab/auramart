export const initialCategories = [
  { id: 'electronics', name: 'Electronics & Tech', icon: 'Cpu', count: 4, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { id: 'fashion', name: 'Apparel & Fashion', icon: 'Shirt', count: 3, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80' },
  { id: 'home', name: 'Home & Living', icon: 'Home', count: 3, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80' },
  { id: 'gaming', name: 'Gaming Gear', icon: 'Gamepad2', count: 2, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80' },
  { id: 'fitness', name: 'Fitness & Sports', icon: 'Dumbbell', count: 2, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80' },
  { id: 'books', name: 'Books & Learning', icon: 'BookOpen', count: 2, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80' }
];

export const initialProducts = [
  {
    id: 'prod-101',
    title: 'AuraSound Max Wireless ANC Headphones',
    tagline: 'Immersive Spatial Audio with 60-Hour Battery Life',
    description: 'Engineered with custom-tuned 40mm beryllium drivers, active noise cancellation, transparency mode, and ultra-soft memory foam ear cushions for all-day luxury sound.',
    price: 249.99,
    originalPrice: 329.99,
    category: 'electronics',
    brand: 'AuraTech',
    rating: 4.8,
    reviewCount: 342,
    stock: 18,
    isFeatured: true,
    isTrending: true,
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Hybrid Active Noise Cancellation (40dB reduction)',
      'Spatial 3D Audio with dynamic head tracking',
      'Up to 60 hours playback (Fast charge: 10 mins = 5 hours)',
      'Multi-device Bluetooth 5.3 connection'
    ],
    specs: {
      'Driver Size': '40mm Beryllium Dynamic',
      'Frequency Response': '10Hz - 40kHz',
      'Weight': '250g',
      'Warranty': '2 Years International'
    },
    colors: ['Midnight Black', 'Silver Frost', 'Deep Indigo']
  },
  {
    id: 'prod-102',
    title: 'Chronos Ultra OLED Smartwatch Pro',
    tagline: 'Titanium Case, ECG Monitor & Dual-Band GPS',
    description: 'The pinnacle of wearable technology. Precision crafted titanium casing, 1000-nit AMOLED display, sapphire crystal glass, advanced health sensors, and 7-day battery life.',
    price: 349.00,
    originalPrice: 429.00,
    category: 'electronics',
    brand: 'Chronos',
    rating: 4.9,
    reviewCount: 512,
    stock: 9,
    isFeatured: true,
    isTrending: true,
    badge: 'Top Rated',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Grade 5 Aerospace Titanium Casing',
      'ECG, SpO2, Heart Rate & Stress Monitoring',
      'Dual-Band L1+L5 Precision GPS Navigation',
      '100m Water Resistance (10 ATM)'
    ],
    specs: {
      'Display': '1.43" Super AMOLED (466x466)',
      'Case Material': 'Titanium Alloy',
      'Battery Life': 'Up to 7 Days',
      'Connectivity': 'Cellular LTE + Wi-Fi + Bluetooth 5.3'
    },
    colors: ['Titanium Gray', 'Starlight Silver', 'Obsidian']
  },
  {
    id: 'prod-103',
    title: 'Luminary M3 Studio Mechanical Keyboard',
    tagline: 'Hot-swappable Gasket Mount with Per-Key RGB',
    description: 'Designed for typing enthusiasts and power users. CNC machined aluminum chassis, gasket mount acoustics, pre-lubed tactile switches, and PBT double-shot keycaps.',
    price: 159.50,
    originalPrice: 189.99,
    category: 'electronics',
    brand: 'Luminary',
    rating: 4.7,
    reviewCount: 189,
    stock: 25,
    isFeatured: false,
    isTrending: true,
    badge: 'Hot Deal',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Full CNC Anodized Aluminum Enclosure',
      'Gasket Mounted Plate with PORON Dampening Foam',
      'Hot-Swappable 3/5 pin PCB',
      'Tri-mode Connection (2.4Ghz Wireless, Bluetooth, USB-C)'
    ],
    specs: {
      'Layout': '75% Compact (82 Keys)',
      'Switches': 'Factory Lubed Tactile Gold',
      'Battery': '4000mAh Lithium-ion',
      'Keycaps': 'PBT Double-Shot Cherry Profile'
    },
    colors: ['Cyber Violet', 'Monochrome Gray', 'Retro Cream']
  },
  {
    id: 'prod-104',
    title: 'PixelView Curved 34" QD-OLED Gaming Monitor',
    tagline: '175Hz, 0.03ms Response, G-Sync Ultimate',
    description: 'Immerse yourself into vibrant virtual worlds with Quantum Dot OLED technology. True black levels, 1,000,000:1 contrast ratio, and hyper-responsive refresh rates.',
    price: 899.99,
    originalPrice: 1099.99,
    category: 'electronics',
    brand: 'PixelView',
    rating: 4.9,
    reviewCount: 94,
    stock: 6,
    isFeatured: true,
    isTrending: false,
    badge: 'Premium',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Ultrawide 34-inch 1800R Curved QD-OLED Panel',
      '175Hz Refresh Rate with 0.03ms GTG Response Time',
      'VESA DisplayHDR True Black 400',
      'Integrated KVM Switch & USB-C 65W Power Delivery'
    ],
    specs: {
      'Resolution': '3440 x 1440 UWQHD',
      'Brightness': '1000 nits Peak',
      'Color Gamut': '99.3% DCI-P3',
      'Ports': '2x HDMI 2.1, 1x DP 1.4, USB-C Hub'
    },
    colors: ['Matte Black']
  },
  {
    id: 'prod-105',
    title: 'Verve Minimalist Merino Wool Hoodie',
    tagline: '100% Organic Extra-Fine Merino Wool',
    description: 'Luxuriously soft, temperature-regulating, and naturally odor-resistant. Tailored modern fit suitable for lounge, office, and travel.',
    price: 119.00,
    originalPrice: 149.00,
    category: 'fashion',
    brand: 'Verve Studio',
    rating: 4.6,
    reviewCount: 142,
    stock: 30,
    isFeatured: false,
    isTrending: true,
    badge: 'Sustainable',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '100% Ethical Certified Merino Wool',
      'Natural Thermo-Regulation (Cool in summer, warm in winter)',
      'Ribbed cuffs and dynamic athletic raglan sleeves',
      'Machine washable on gentle wool cycle'
    ],
    specs: {
      'Material': '100% Merino Wool 220 GSM',
      'Fit': 'Tailored Modern Fit',
      'Care': 'Machine wash cold, lay flat to dry'
    },
    colors: ['Charcoal Gray', 'Oatmeal Beige', 'Forest Green']
  },
  {
    id: 'prod-106',
    title: 'UrbanTrek Waterproof Modular Backpack 30L',
    tagline: 'Weatherproof Cordura Fabric with TSA Laptop Sleeve',
    description: 'Built for urban commuters and globe-trotters alike. Features expandable capacity, anti-theft hidden pockets, magnetic Fidlock buckles, and ergonomic air-mesh back support.',
    price: 135.00,
    originalPrice: 165.00,
    category: 'fashion',
    brand: 'UrbanTrek',
    rating: 4.8,
    reviewCount: 278,
    stock: 22,
    isFeatured: true,
    isTrending: false,
    badge: 'Popular',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '1000D Ballistic Nylon Waterproof Construction',
      '16" Padded TSA Quick-Scan Laptop Compartment',
      'Fidlock V-Buckle Magnetic Fasteners',
      'Hidden Passport Pocket & Luggage Pass-Through Strap'
    ],
    specs: {
      'Capacity': '22L to 30L Expandable',
      'Dimensions': '48cm x 32cm x 18cm',
      'Weight': '1.1kg'
    },
    colors: ['Matte Black', 'Olive Drab', 'Navy Blue']
  },
  {
    id: 'prod-107',
    title: 'AuraGlow Smart Ambient LED Bar Lamp',
    tagline: 'Syncs with Music, Movies & Smart Home Ecosystems',
    description: 'Transform your living space or gaming setup with 16.8 million colors, dynamic scene modes, voice control compatibility, and sleek brushed aluminum construction.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'home',
    brand: 'AuraGlow',
    rating: 4.7,
    reviewCount: 165,
    stock: 40,
    isFeatured: true,
    isTrending: true,
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '16.8 Million RGBIC Colors with Segment Control',
      'Built-in Microphone for Real-time Music Rhythm Sync',
      'Works with Alexa, Google Assistant & Apple HomeKit',
      'Dimmable 1% to 100% Brightness'
    ],
    specs: {
      'Luminous Flux': '800 Lumens',
      'Power Source': 'AC Adapter 24W',
      'Connectivity': 'Wi-Fi 2.4GHz + Bluetooth 5.0'
    },
    colors: ['Brushed Black', 'Silver Aluminum']
  },
  {
    id: 'prod-108',
    title: 'BaristaCraft Precision Espresso Machine',
    tagline: 'PID Temperature Control & Commercial Steam Wand',
    description: 'Bring coffee-shop quality to your kitchen. Italian 15-bar pump pressure, digital temperature regulation, integrated conical burr grinder, and micro-foam steam wand.',
    price: 499.00,
    originalPrice: 599.00,
    category: 'home',
    brand: 'BaristaCraft',
    rating: 4.9,
    reviewCount: 420,
    stock: 12,
    isFeatured: true,
    isTrending: false,
    badge: 'Editor Choice',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '15-Bar High Pressure Italian Pump',
      'Integrated Conical Burr Grinder with 30 Grind Settings',
      'PID Digital Temperature Control (+/- 1°C accuracy)',
      'Powerful Swivel Micro-foam Steam Wand'
    ],
    specs: {
      'Water Tank Capacity': '2.0L Removable Tank',
      'Bean Hopper Capacity': '250g',
      'Material': 'Stainless Steel'
    },
    colors: ['Brushed Stainless', 'Matte Black', 'Truffle White']
  },
  {
    id: 'prod-109',
    title: 'Nexus Pro Wireless Haptic Gaming Controller',
    tagline: 'Hall Effect Joysticks, Ultra-Low Latency & Mechanical Triggers',
    description: 'Dominate every game with zero stick drift. Features magnetic Hall Effect sensors, mechanical tactile switches, customizable back paddles, and multi-platform compatibility.',
    price: 89.99,
    originalPrice: 109.99,
    category: 'gaming',
    brand: 'Nexus Gaming',
    rating: 4.8,
    reviewCount: 310,
    stock: 35,
    isFeatured: false,
    isTrending: true,
    badge: 'Zero Drift',
    images: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Non-contact Hall Effect Magnetic Joysticks (0% Drift)',
      'Customizable Back Rear Map Paddles',
      'Hair Trigger Mode for FPS Games',
      'Cross-Platform: PC, Switch, iOS, Android, Steam Deck'
    ],
    specs: {
      'Polling Rate': '1000Hz (1ms Latency)',
      'Battery': '1200mAh (Up to 20 Hours)',
      'Weight': '210g'
    },
    colors: ['Frost White', 'Cyber Purple', 'Midnight']
  },
  {
    id: 'prod-110',
    title: 'TitanGrip Adjustable Smart Dumbbell Set',
    tagline: '5lb to 52.5lb Instant Weight Selector with Bluetooth App Sync',
    description: 'Replaces 15 sets of weights in one compact design. Twist the handle to instantly adjust weight from 5 to 52.5 lbs with automatic workout tracking on your phone.',
    price: 299.99,
    originalPrice: 379.99,
    category: 'fitness',
    brand: 'TitanGrip',
    rating: 4.7,
    reviewCount: 198,
    stock: 14,
    isFeatured: false,
    isTrending: true,
    badge: 'Save Space',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '15 Weight Settings in 2.5lb Increments (5 to 52.5 lbs)',
      'Smooth Dial Select Mechanism with Safety Latch',
      'Durable Molded Steel Plates with Quiet Rubber Coating',
      'Includes Storage Trays & Companion Workout App'
    ],
    specs: {
      'Max Weight': '52.5 lbs (23.8 kg) each',
      'Dimensions': '40cm x 20cm x 23cm',
      'Warranty': '3 Years Frame Warranty'
    },
    colors: ['Obsidian Black / Red Accent']
  },
  {
    id: 'prod-111',
    title: 'Velocita Pro Carbon Fiber Running Shoes',
    tagline: 'Energy Return Foam + Full-Length Carbon Plate',
    description: 'Push your personal best. Engineered with super-critical nitrogen-infused foam cushion and a full-length carbon fiber propulsion plate for maximal energy return.',
    price: 199.99,
    originalPrice: 239.99,
    category: 'fitness',
    brand: 'Velocita',
    rating: 4.9,
    reviewCount: 230,
    stock: 19,
    isFeatured: true,
    isTrending: false,
    badge: 'Pro Performance',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Full-Length Curved Carbon Fiber Plate',
      'Nitrogen-Infused High Resilience Midsole Foam',
      'Breathable Monomesh Upper with Lockdown Fit',
      'High-Traction Rubber Outsole for Wet & Dry Surfaces'
    ],
    specs: {
      'Weight': '195g (Men Size 9)',
      'Heel-to-Toe Drop': '8mm',
      'Terrain': 'Road Racing & Marathons'
    },
    colors: ['Neon Crimson', 'Electric Teal', 'Phantom White']
  },
  {
    id: 'prod-112',
    title: 'Atomic Habits & Systems Masterclass Book',
    tagline: 'Hardcover Collector Edition with Gold Foil & Leather Ribbon',
    description: 'The definitive guide to building good habits, breaking bad ones, and mastering small behaviors that lead to remarkable results. Premium leatherette cover with bookmark ribbon.',
    price: 28.00,
    originalPrice: 35.00,
    category: 'books',
    brand: 'Aura Publishing',
    rating: 5.0,
    reviewCount: 1240,
    stock: 50,
    isFeatured: true,
    isTrending: true,
    badge: '#1 Bestseller',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Deluxe Collectors Edition with Embossed Gold Foil Cover',
      'Includes Exclusive Habit Tracker Companion Journal',
      'High-grade 100gsm acid-free ivory paper',
      'Author Signed Bookplate Included'
    ],
    specs: {
      'Pages': '384 Pages',
      'Format': 'Hardcover Clothbound',
      'Language': 'English'
    },
    colors: ['Collector Gold Edition']
  }
];

export const initialCoupons = [
  { code: 'AURA20', discountPercent: 20, description: '20% off entire store' },
  { code: 'WELCOME10', discountAmount: 10, description: '$10 off your first purchase' },
  { code: 'FREESHIP', freeShipping: true, description: 'Free Express Shipping' }
];

export const initialReviews = [
  {
    id: 'rev-1',
    productId: 'prod-101',
    userName: 'Alexander Wright',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-08-10',
    title: 'Incredible Active Noise Cancellation and Soundstage!',
    comment: 'The sound quality on these AuraSound Max headphones blew me away. Super soft earcups, ANC cuts out plane noise completely. Worth every penny!',
    verified: true
  },
  {
    id: 'rev-2',
    productId: 'prod-101',
    userName: 'Sophia Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-08-05',
    title: 'Sleek design, 60hr battery is real!',
    comment: 'I charged them on Sunday and used them all week at work without recharging once. Dynamic head tracking is super fun for movies.',
    verified: true
  },
  {
    id: 'rev-3',
    productId: 'prod-102',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-08-12',
    title: 'Best smartwatch I have ever owned',
    comment: 'Titanium build feels super premium. GPS lock is instant even when running in dense city center. Battery easily lasts 6-7 days.',
    verified: true
  }
];
