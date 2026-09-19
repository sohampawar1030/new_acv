const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

const tutorsData = [
  { name: 'Aniket Deshpande', email: 'aniket@pune.com', bio: 'Math and Physics specialist for JEE.', exp: 12, city: 'Pune', price: 600, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
  { name: 'Snehal Patil', email: 'snehal@mumbai.com', bio: 'Classical Dance and Yoga instructor.', exp: 8, city: 'Mumbai', price: 400, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' },
  { name: 'Vikram Singh', email: 'vikram@delhi.com', bio: 'UPSC preparation mentor with 5 years experience.', exp: 5, city: 'Delhi', price: 800, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
  { name: 'Kavita Iyer', email: 'kavita@bangalore.com', bio: 'Python and Data Science expert.', exp: 7, city: 'Bangalore', price: 1200, img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' },
  { name: 'Arjun Reddy', email: 'arjun@hyderabad.com', bio: 'Spoken English and Personality Development.', exp: 10, city: 'Hyderabad', price: 500, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { name: 'Meera Nair', email: 'meera@chennai.com', bio: 'Carnatic Music and Veena teacher.', exp: 15, city: 'Chennai', price: 900, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
  { name: 'Rajesh Gupta', email: 'rajesh@kolkata.com', bio: 'CA and Commerce coaching.', exp: 20, city: 'Kolkata', price: 1500, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d' },
  { name: 'Pooja Shah', email: 'pooja@ahmedabad.com', bio: 'French language classes for students.', exp: 4, city: 'Ahmedabad', price: 700, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
  { name: 'Aditya Verma', email: 'aditya@jaipur.com', bio: 'Sketching and Oil Painting artist.', exp: 6, city: 'Jaipur', price: 450, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
  { name: 'Sonal Mehta', email: 'sonal@surat.com', bio: 'Digital Marketing and SEO trainer.', exp: 5, city: 'Surat', price: 1000, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2' },
  { name: 'Deepak Rao', email: 'deepak@pune.com', bio: 'Guitar and Keyboard teacher.', exp: 9, city: 'Pune', price: 550, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' },
  { name: 'Nisha Sharma', email: 'nisha@delhi.com', bio: 'Biology and NEET prep specialist.', exp: 11, city: 'Delhi', price: 750, img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604' },
  { name: 'Rohan Malhotra', email: 'rohan@mumbai.com', bio: 'Professional Cooking and Bakery chef.', exp: 14, city: 'Mumbai', price: 2000, img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea' },
  { name: 'Amrita Kaur', email: 'amrita@bangalore.com', bio: 'German language B2 level trainer.', exp: 6, city: 'Bangalore', price: 850, img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4' },
  { name: 'Sanjay Mishra', email: 'sanjay@pune.com', bio: 'Vedic Maths and Abacus for kids.', exp: 18, city: 'Pune', price: 300, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7' },
  { name: 'Ritu Singh', email: 'ritu@lucknow.com', bio: 'Handwriting and Calligraphy expert.', exp: 4, city: 'Lucknow', price: 250, img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91' },
  { name: 'Abhishek Das', email: 'abhishek@kolkata.com', bio: 'Advanced Java and Spring Boot coaching.', exp: 8, city: 'Kolkata', price: 1100, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d' },
  { name: 'Tanvi Joshi', email: 'tanvi@pune.com', bio: 'Spanish classes for all levels.', exp: 7, city: 'Pune', price: 650, img: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c' },
  { name: 'Harsh Vardhan', email: 'harsh@delhi.com', bio: 'Personal Fitness and Gym Trainer.', exp: 10, city: 'Delhi', price: 1500, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
  { name: 'Kriti Aggarwal', email: 'kriti@bangalore.com', bio: 'UI/UX Design and Figma mentorship.', exp: 5, city: 'Bangalore', price: 1300, img: 'https://images.unsplash.com/photo-1548142813-c348350df52b' },
  { name: 'Manish Pandey', email: 'manish@pune.com', bio: 'Swimming coach for kids and adults.', exp: 15, city: 'Pune', price: 400, img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce' },
  { name: 'Shweta Tiwari', email: 'shweta@mumbai.com', bio: 'Zumba and Aerobics instructor.', exp: 6, city: 'Mumbai', price: 500, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04' },
  { name: 'Vivek Joshi', email: 'vivek@pune.com', bio: 'Artificial Intelligence and ML coach.', exp: 4, city: 'Pune', price: 2000, img: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3' },
  { name: 'Ananya Roy', email: 'ananya@kolkata.com', bio: 'Pottery and Ceramic arts teacher.', exp: 12, city: 'Kolkata', price: 600, img: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993' },
  { name: 'Suresh Kumar', email: 'suresh@chennai.com', bio: 'Chess Grandmaster coaching for kids.', exp: 25, city: 'Chennai', price: 1000, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61' },
  { name: 'Isha Gupta', email: 'isha@jaipur.com', bio: 'Fashion Designing and Tailoring.', exp: 9, city: 'Jaipur', price: 550, img: 'https://images.unsplash.com/photo-1534751411349-4eb4214d2fc9' },
  { name: 'Prateek Jain', email: 'prateek@indore.com', bio: 'CAT and MBA Entrance coaching.', exp: 7, city: 'Indore', price: 1800, img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea' },
  { name: 'Mansi Vohra', email: 'mansi@chandigarh.com', bio: 'IELTS and TOEFL prep expert.', exp: 8, city: 'Chandigarh', price: 950, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1' },
  { name: 'Rahul Deshmukh', email: 'rahul@pune.com', bio: 'Organic Farming and Gardening tutor.', exp: 5, city: 'Pune', price: 300, img: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef' },
  { name: 'Divya Sharma', email: 'divya@delhi.com', bio: 'Mental Health and Life Coach.', exp: 12, city: 'Delhi', price: 2500, img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6' }
];

async function seed() {
  for (const t of tutorsData) {
    try {
      // Insert User
      const [userRes] = await connection.promise().query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, 'pass123', 'tutor') ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",
        [t.name, t.email]
      );
      const userId = userRes.insertId;

      // Insert Tutor
      await connection.promise().query(
        "INSERT INTO tutors (user_id, bio, experience, rating, photo_url, location, price_per_hour) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, t.bio, t.exp, (Math.random() * (5 - 4) + 4).toFixed(1), t.img, t.city, t.price]
      );
      console.log(`Added ${t.name}`);
    } catch (err) {
      console.error(`Error adding ${t.name}:`, err.message);
    }
  }
  console.log('Finished adding 30 tutors.');
  process.exit();
}

seed();
