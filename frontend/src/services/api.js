const API_URL = "http://localhost:8080/api";
const USE_MOCK = true;
import { mockQuestions } from './questions';

// Helper to generate topics
const createTopics = () => {
  const topics = [];

  const subjects = {
    6: {
      Mathematics: ["Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra"],
      Science: ["Food: Where Does It Come From?", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "The Living Organisms", "Motion and Measurement of Distances"],
      SST: ["The Earth in the Solar System", "Globe: Latitudes and Longitudes", "Motions of the Earth", "Maps", "Major Domains of the Earth", "What, Where, How and When?", "On the Trail of the Earliest People", "From Gathering to Growing Food", "In the Earliest Cities", "Understanding Diversity"],
      English: ["A Tale of Two Birds", "The Friendly Mongoose", "The Shepherd’s Treasure", "The Old-Clock Shop", "Taro’s Reward", "Who Did Patrick’s Homework?", "How the Dog Found Himself a New Master?", "An Indian – American Woman in Space: Kalpana Chawla"],
      Hindi: ["वह चिड़िया जो", "बचपन", "नादान दोस्त", "चाँद से थोड़ी सी गप्पें", "अक्षरों का महत्व", "पार नज़र के", "साथी हाथ बढ़ाना", "ऐसे - ऐसे", "टिकट अलबम"],
      Punjabi: ["Tricolor (Tiranga)", "My Village", "The Peacock", "Shaheed Bhagat Singh", "Diwali", "Cleanliness", "Morning Walk"],
      ComputerScience: ["Computer Fundamentals", "Windows 10", "More on PowerPoint 2016", "Formulas and Functions in Excel 2016", "Introduction to QBasic", "Surfing the Internet"]
    },
    7: {
      Mathematics: ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry"],
      Science: ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases, and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms"],
      SST: ["Environment", "Inside Our Earth", "Our Changing Earth", "Air", "Water", "Tracing Changes Through A Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Rulers and Buildings"],
      English: ["Three Questions", "A Gift of Chappals", "Gopal and the Hilsa Fish", "The Ashes That Made Trees Bloom", "Quality", "Expert Detectives", "The Invention of Vita-Wonk", "Fire: Friend and Foe"],
      Hindi: ["हम पंछी उन्मुक्त गगन के", "दादी माँ", "हिमालय की बेटियाँ", "कठपुतली", "मिठाईवाला", "रक्त और हमारा शरीर", "पापा खो गए", "शाम एक किसान", "चिड़िया की बच्ची"],
      Punjabi: ["Ghadar Party", "Baisakhi", "Guru Nanak Dev Ji", "The Cow", "Pollution", "Library", "My School"],
      ComputerScience: ["Number System", "Formulas and Functions", "Charts in Excel 2016", "More on Python", "HTML5 - Introduction", "Cyber Safety"]
    },
    8: {
      Mathematics: ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions", "Visualising Solid Shapes"],
      Science: ["Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals", "Force and Pressure"],
      SST: ["Resources", "Land, Soil, Water, Natural Vegetation", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources", "How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age"],
      English: ["The Best Christmas Present in the World", "The Tsunami", "Glimpses of the Past", "Bepin Choudhury’s Lapse of Memory", "The Summit Within", "This is Jody’s Fawn", "A Visit to Cambridge", "A Short Monsoon Diary"],
      Hindi: ["ध्वनि", "लाख की चूड़ियाँ", "बस की यात्रा", "दीवानों की हस्ती", "चिट्ठियों की अनूठी दुनिया", "भगवान के डाकिए", "क्या निराश हुआ जाए", "यह सबसे कठिन समय नहीं", "कबीर की साखियाँ"],
      Punjabi: ["Sri Guru Gobind Singh Ji", "Patriotism", "Discipline", "Wonders of Science", "Health is Wealth", "Games and Sports", "My Hobby"],
      ComputerScience: ["Computer Network", "Access 2016", "Queries, Forms and Reports", "Looping in Python", "Lists and Dictionaries in Python", "Introduction to Artificial Intelligence"]
    },
    9: {
      Mathematics: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid’s Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles"],
      Science: ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation"],
      SST: ["India – Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population", "The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism"],
      English: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Snake and the Mirror", "My Childhood", "Packing", "Reach for the Top", "The Bond of Love", "Kathmandu"],
      Hindi: ["दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति", "सांवले सपनों की याद", "नाना साहब की पुत्री", "प्रेमचंद के फटे जूते", "मेरे बचपन के दिन", "एक कुत्ता और एक मैना"],
      Punjabi: ["Guru Nanak Dev Ji", "Maharaja Ranjit Singh", "Fair of Chappar Chiri", "Save Water", "Drug Addiction", "Value of Time", "Mobile Phone"],
      ComputerScience: ["Computer System", "Input and Output Devices", "Types of Software", "Operating System", "Working with Windows 7/10", "OpenOffice Writer", "OpenOffice Calc", "OpenOffice Impress"]
    },
    10: {
      Mathematics: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles"],
      Science: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-Metals", "Carbon and its Compounds", "Periodic Classification of Elements", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light – Reflection and Refraction"],
      SST: ["Power Sharing", "Federalism", "Democracy and Diversity", "Gender, Religion and Caste", "Popular Struggles and Movements", "Political Parties", "Outcomes of Democracy", "Challenges to Democracy", "The Rise of Nationalism in Europe", "Nationalism in India"],
      English: ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank", "The Hundred Dresses – I", "The Hundred Dresses – II", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares"],
      Hindi: ["पद (सूरदास)", "राम-लक्ष्मण-परशुराम संवाद", "सवैया और कवित्त", "आत्मकथ्य", "उत्साह और अट नहीं रही", "यह दंतुरित मुस्कान", "छाया मत छूना", "कन्यादान", "संगतकार"],
      Punjabi: ["Shaheed Kartar Singh Sarabha", "Bibi Bhani Ji", "Importance of Trees", "Dowry System", "Unemployment", "Co-operation", "Ideal Student"],
      ComputerScience: ["Internet Basics", "Internet Services", "Database Concepts", "Microsoft Access", "HTML", "Inserting Images and Links in HTML", "Forms in HTML"]
    }
  };

  Object.keys(subjects).forEach(grade => {
    Object.keys(subjects[grade]).forEach(subject => {
      subjects[grade][subject].forEach((topicName, index) => {
        topics.push({
          id: `${grade}-${subject}-${index}`,
          name: topicName,
          subject: subject,
          gradeLevels: [parseInt(grade)],
          questions: new Array(5) // Mock questions placeholder so UI shows available questions
        });
      });
    });
  });

  return topics;
};

// Mock Data
const mockTopics = createTopics();

// Mock Questions Database with Subjects and Grades
// Deleted old mockQuestions
const oldMockQuestions = [
  // ================= GRADE 6 =================
  // --- Math (Knowing Our Numbers) ---
  { id: 'm6-1', subject: 'Mathematics', grade: 6, topicName: "Knowing Our Numbers", text: 'Smallest 4-digit number is?', options: ['1000', '1111', '9999', '0001'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'm6-2', subject: 'Mathematics', grade: 6, topicName: "Knowing Our Numbers", text: 'Place value of 5 in 5432?', options: ['5', '50', '500', '5000'], correctOptionIndex: 3, difficulty: 'EASY' },
  { id: 'm6-3', subject: 'Mathematics', grade: 6, text: 'Successor of 1001?', options: ['1000', '1002', '1010', '1100'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'm6-4', subject: 'Mathematics', grade: 6, text: '1 million = ? lakhs', options: ['1', '10', '100', '1000'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 'm6-5', subject: 'Mathematics', grade: 6, text: 'Roman Numeral for 50?', options: ['L', 'V', 'X', 'C'], correctOptionIndex: 0, difficulty: 'EASY' },

  // --- Science (Survival Mode) ---
  { id: 's6-1', subject: 'Science', grade: 6, topicName: "Food: Where Does It Come From?", text: 'Bees collect nectar from?', options: ['Roots', 'Leaves', 'Flowers', 'Stem'], correctOptionIndex: 2, difficulty: 'EASY' },
  { id: 's6-2', subject: 'Science', grade: 6, topicName: "Food: Where Does It Come From?", text: 'Deer eats only plant, so it is?', options: ['Carnivore', 'Herbivore', 'Omnivore', 'Insectivore'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 's6-3', subject: 'Science', grade: 6, text: 'Main source of protein?', options: ['Rice', 'Potato', 'Pulses', 'Spinach'], correctOptionIndex: 2, difficulty: 'MEDIUM' },
  { id: 's6-4', subject: 'Science', grade: 6, text: 'Vitamin D comes from?', options: ['Sunlight', 'Water', 'Air', 'Soil'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 's6-5', subject: 'Science', grade: 6, text: 'Deficiency of Iron causes?', options: ['Goiter', 'Anemia', 'Scurvy', 'Rickets'], correctOptionIndex: 1, difficulty: 'HARD' },

  // --- Hindi (Sentence Builder) ---
  { id: 'h6-1', subject: 'Hindi', grade: 6, text: 'Arrange: (चिड़िया / है / उड़ / रही)', options: ['चिड़िया', 'उड़', 'रही', 'है'], answer: 'चिड़िया उड़ रही है', correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'h6-2', subject: 'Hindi', grade: 6, text: 'Arrange: (मेरा / है / भारत / देश)', options: ['भारत', 'मेरा', 'देश', 'है'], answer: 'भारत मेरा देश है', correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'h6-3', subject: 'Hindi', grade: 6, text: 'Arrange: (सूर्य / है / देता / रोशनी)', options: ['सूर्य', 'रोशनी', 'देता', 'है'], answer: 'सूर्य रोशनी देता है', correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'h6-4', subject: 'Hindi', grade: 6, text: 'Arrange: (पानी / पियो / साफ)', options: ['साफ', 'पानी', 'पियो'], answer: 'साफ पानी पियो', correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'h6-5', subject: 'Hindi', grade: 6, text: 'Arrange: (हवा / रही / चल / है)', options: ['हवा', 'चल', 'रही', 'है'], answer: 'हवा चल रही है', correctOptionIndex: 0, difficulty: 'EASY' },

  // --- CS (Memory Match) ---
  { id: 'cs6-1', subject: 'ComputerScience', grade: 6, text: 'Brain of Computer', textHi: 'कंप्यूटर का दिमाग', options: ['CPU', 'Mouse', 'Monitor', 'Keyboard'], correctAnswer: 'CPU', correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs6-2', subject: 'ComputerScience', grade: 6, text: 'Input Device', textHi: 'इनपुट डिवाइस', options: ['Keyboard', 'Speaker', 'Printer', 'Monitor'], correctAnswer: 'Keyboard', correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs6-3', subject: 'ComputerScience', grade: 6, text: 'Temporary Memory', textHi: 'अस्थायी मेमोरी', options: ['RAM', 'ROM', 'HDD', 'SSD'], correctAnswer: 'RAM', correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs6-4', subject: 'ComputerScience', grade: 6, text: 'Pointing Device', textHi: 'पॉइंटिंग डिवाइस', options: ['Mouse', 'Scanner', 'Printer', 'Speaker'], correctAnswer: 'Mouse', correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs6-5', subject: 'ComputerScience', grade: 6, text: 'Output Device', textHi: 'आउटपुट डिवाइस', options: ['Monitor', 'Keyboard', 'Mouse', 'Scanner'], correctAnswer: 'Monitor', correctOptionIndex: 0, difficulty: 'EASY' },

  // ================= GRADE 7 =================
  // --- Math ---
  { id: 'm7-1', subject: 'Mathematics', grade: 7, text: '(-10) + (+5) = ?', options: ['-5', '-15', '5', '15'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'm7-2', subject: 'Mathematics', grade: 7, text: 'Area of a rectangle?', options: ['l + b', '2(l+b)', 'l x b', 'l/b'], correctOptionIndex: 2, difficulty: 'MEDIUM' },
  { id: 'm7-3', subject: 'Mathematics', grade: 7, text: 'Product of 0.2 and 0.3?', options: ['0.6', '0.06', '6.0', '0.006'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 'm7-4', subject: 'Mathematics', grade: 7, text: 'Mean of 1, 2, 3, 4, 5', options: ['2', '3', '4', '5'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'm7-5', subject: 'Mathematics', grade: 7, text: 'Simple Interest Formula', options: ['P*R*T/100', 'P+R+T', 'P*R*T', 'P/R/T'], correctOptionIndex: 0, difficulty: 'EASY' },

  // --- Science (Survival) ---
  { id: 's7-1', subject: 'Science', grade: 7, text: 'Acid turns blue litmus to?', options: ['Red', 'Green', 'Yellow', 'Black'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 's7-2', subject: 'Science', grade: 7, text: 'Base turns red litmus to?', options: ['Red', 'Blue', 'Yellow', 'Black'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 's7-3', subject: 'Science', grade: 7, text: 'Ruminants digest?', options: ['Cellulose', 'Plastic', 'Metal', 'Glass'], correctOptionIndex: 0, difficulty: 'HARD' },
  { id: 's7-4', subject: 'Science', grade: 7, text: 'Heat flows from?', options: ['Hot to Cold', 'Cold to Hot', 'Both ways', 'None'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 's7-5', subject: 'Science', grade: 7, text: 'Breathing organ in fish?', options: ['Lungs', 'Gills', 'Skin', 'Trachea'], correctOptionIndex: 1, difficulty: 'EASY' },

  // --- English (Rapid Fire) ---
  { id: 'e7-1', subject: 'English', grade: 7, text: 'Synonym for "HAPPY"?', options: ['Sad', 'Joyful', 'Angry', 'Bored'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'e7-2', subject: 'English', grade: 7, text: 'Past tense of "GO"?', options: ['Goed', 'Gone', 'Went', 'Going'], correctOptionIndex: 2, difficulty: 'EASY' },
  { id: 'e7-3', subject: 'English', grade: 7, text: 'Plural of "Child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'e7-4', subject: 'English', grade: 7, text: 'Antonym of "Cold"?', options: ['Freezing', 'Hot', 'Cool', 'Icy'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'e7-5', subject: 'English', grade: 7, text: 'Is "Beautiful" a?', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], correctOptionIndex: 2, difficulty: 'MEDIUM' },

  // --- CS (Code Breaker) ---
  { id: 'cs7-1', subject: 'ComputerScience', grade: 7, text: 'What is the output?', textHi: 'आउटपुट क्या होगा?', codeSnippet: 'print(10 + 5)', correctAnswer: '15', options: ['15'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs7-2', subject: 'ComputerScience', grade: 7, text: 'Which tag makes text bold?', textHi: 'कौन सा टैग टेक्स्ट को बोल्ड करता है?', codeSnippet: '<_>Bold Text</_>', correctAnswer: 'b', options: ['b'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs7-3', subject: 'ComputerScience', grade: 7, text: 'Closing tag for <html>?', textHi: '<html> के लिए क्लोजिंग टैग?', codeSnippet: 'Start: <html> ... End: ?', correctAnswer: '</html>', options: ['</html>'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs7-4', subject: 'ComputerScience', grade: 7, text: 'Short for Electronic Mail?', textHi: 'इलेक्ट्रॉनिक मेल का संक्षिप्त रूप?', codeSnippet: 'e____', correctAnswer: 'email', options: ['email'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs7-5', subject: 'ComputerScience', grade: 7, text: 'Output of: print("Hi" * 3)', textHi: 'आउटपुट: print("Hi" * 3)', codeSnippet: 'print("Hi" * 3)', correctAnswer: 'HiHiHi', options: ['HiHiHi'], correctOptionIndex: 0, difficulty: 'MEDIUM' },

  // ================= GRADE 8 =================
  // --- Math ---
  { id: 'm8-1', subject: 'Mathematics', grade: 8, text: 'Square root of 64?', options: ['6', '7', '8', '9'], correctOptionIndex: 2, difficulty: 'EASY' },
  { id: 'm8-2', subject: 'Mathematics', grade: 8, text: '2x + 3 = 13, x = ?', options: ['2', '3', '4', '5'], correctOptionIndex: 3, difficulty: 'MEDIUM' },
  { id: 'm8-3', subject: 'Mathematics', grade: 8, text: 'Cube root of 27?', options: ['2', '3', '4', '9'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'm8-4', subject: 'Mathematics', grade: 8, text: 'Percentage: 50% of 200', options: ['50', '100', '150', '200'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'm8-5', subject: 'Mathematics', grade: 8, text: 'Area of Circle?', options: ['2πr', 'πr²', '2πr²', 'πd'], correctOptionIndex: 1, difficulty: 'MEDIUM' },

  // --- Science (Survival) ---
  { id: 's8-1', subject: 'Science', grade: 8, text: 'Metals are generally?', options: ['Soft', 'Hard', 'Liquid', 'Gas'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 's8-2', subject: 'Science', grade: 8, text: 'Force is measured in?', options: ['Newton', 'Joule', 'Pascal', 'Watt'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 's8-3', subject: 'Science', grade: 8, text: 'Sound cannot travel in?', options: ['Solid', 'Liquid', 'Gas', 'Vacuum'], correctOptionIndex: 3, difficulty: 'MEDIUM' },
  { id: 's8-4', subject: 'Science', grade: 8, text: 'Cell was discovered by?', options: ['Hooke', 'Darwin', 'Newton', 'Einstein'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 's8-5', subject: 'Science', grade: 8, text: 'Good conductor of electricity?', options: ['Wood', 'Plastic', 'Copper', 'Rubber'], correctOptionIndex: 2, difficulty: 'EASY' },

  // --- English (Rapid Fire) ---
  { id: 'e8-1', subject: 'English', grade: 8, text: 'Antonym of "Ancient"?', options: ['Old', 'Modern', 'Antique', 'Past'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'e8-2', subject: 'English', grade: 8, text: 'Synonym for "Huge"?', options: ['Tiny', 'Small', 'Gigantic', 'Weak'], correctOptionIndex: 2, difficulty: 'EASY' },
  { id: 'e8-3', subject: 'English', grade: 8, text: 'Past Participle of "Eat"?', options: ['Ate', 'Eaten', 'Eating', 'Eats'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 'e8-4', subject: 'English', grade: 8, text: 'Correct spelling?', options: ['Definite', 'Defanite', 'Definit', 'Difenite'], correctOptionIndex: 0, difficulty: 'HARD' },
  { id: 'e8-5', subject: 'English', grade: 8, text: 'Homophone of "See"?', options: ['Sea', 'Saw', 'Seen', 'Scene'], correctOptionIndex: 0, difficulty: 'MEDIUM' },

  // --- CS (Code Breaker) ---
  { id: 'cs8-1', subject: 'ComputerScience', grade: 8, text: 'Fix the loop syntax:', textHi: 'लूप सिंटैक्स ठीक करें:', codeSnippet: 'for i in range(5)\n    print(i)', correctAnswer: ':', options: [':'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs8-2', subject: 'ComputerScience', grade: 8, text: 'Variable assignment in Python?', textHi: 'पायथन में वेरिएबल असाइनमेंट?', codeSnippet: 'x _ 10', correctAnswer: '=', options: ['='], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs8-3', subject: 'ComputerScience', grade: 8, text: 'Output of: 10 % 3', textHi: 'आउटपुट क्या होगा: 10 % 3', codeSnippet: '10 % 3', correctAnswer: '1', options: ['1'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs8-4', subject: 'ComputerScience', grade: 8, text: 'Function keyword in Python?', textHi: 'पायथन में फंक्शन कीवर्ड?', codeSnippet: '_ myFunc():', correctAnswer: 'def', options: ['def'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs8-5', subject: 'ComputerScience', grade: 8, text: 'List bracket type?', textHi: 'लिस्ट ब्रैकेट प्रकार?', codeSnippet: 'myList = _ 1, 2, 3 _', correctAnswer: '[]', options: ['[]'], correctOptionIndex: 0, difficulty: 'EASY' },

  // ================= GRADE 9 =================
  // --- Math ---
  { id: 'm9-1', subject: 'Mathematics', grade: 9, text: 'Value of π (approx)?', textHi: 'π का मान (लगभग)?', options: ['3.14', '2.14', '4.14', '1.14'], optionsHi: ['3.14', '2.14', '4.14', '1.14'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'm9-2', subject: 'Mathematics', grade: 9, text: 'Sum of angles in a triangle?', textHi: 'त्रिभुज के कोणों का योग?', options: ['180°', '360°', '90°', '270°'], optionsHi: ['180°', '360°', '90°', '270°'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'm9-3', subject: 'Mathematics', grade: 9, text: 'Degree of polynomial x³ + x?', textHi: 'बहुपद x³ + x की घात?', options: ['1', '2', '3', '4'], optionsHi: ['1', '2', '3', '4'], correctOptionIndex: 2, difficulty: 'EASY' },
  { id: 'm9-4', subject: 'Mathematics', grade: 9, text: 'Point (0,5) lies on?', textHi: 'बिंदु (0,5) स्थित है?', options: ['X-axis', 'Y-axis', 'Origin', 'None'], optionsHi: ['एक्स-अक्ष', 'वाई-अक्ष', 'मूल बिंदु', 'कोई नहीं'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 'm9-5', subject: 'Mathematics', grade: 9, text: 'Herons Formula finds?', textHi: 'हेरोन का सूत्र क्या ज्ञात करता है?', options: ['Area of Circle', 'Area of Triangle', 'Volume of Cube', 'Perimeter'], optionsHi: ['वृत्त का क्षेत्रफल', 'त्रिभुज का क्षेत्रफल', 'घन का आयतन', 'परिमाप'], correctOptionIndex: 1, difficulty: 'MEDIUM' },

  // --- Science ---
  { id: 's9-1', subject: 'Science', grade: 9, text: 'Unit of Force?', textHi: 'बल का मात्रक?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], optionsHi: ['जूल', 'न्यूटन', 'वाट', 'पास्कल'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 's9-2', subject: 'Science', grade: 9, text: 'Speed of sound is max in?', textHi: 'ध्वनि की गति अधिकतम होती है?', options: ['Air', 'Water', 'Solids', 'Vacuum'], optionsHi: ['हवा', 'पानी', 'ठोस', 'निर्वात'], correctOptionIndex: 2, difficulty: 'MEDIUM' },
  { id: 's9-3', subject: 'Science', grade: 9, text: 'Work = Force x ?', textHi: 'कार्य = बल x ?', options: ['Time', 'Distance', 'Velocity', 'Mass'], optionsHi: ['समय', 'दूरी', 'वेग', 'द्रव्यमान'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 's9-4', subject: 'Science', grade: 9, text: 'Atomic number of Carbon?', textHi: 'कार्बन की परमाणु संख्या?', options: ['4', '6', '8', '12'], optionsHi: ['4', '6', '8', '12'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 's9-5', subject: 'Science', grade: 9, text: 'Powerhouse of Cell?', textHi: 'कोशिका का पावरहाउस?', options: ['Nucleus', 'Mitochondria', 'Lysosome', 'Ribosome'], optionsHi: ['केंद्रक', 'मिटोकॉन्ड्रिया', 'lysosome', 'राइबोसोम'], correctOptionIndex: 1, difficulty: 'EASY' },

  // --- English (Rapid Fire) ---
  { id: 'e9-1', subject: 'English', grade: 9, text: 'Choose the correct spelling:', textHi: 'सही वर्तनी चुनें:', options: ['Recieve', 'Receive', 'Riceive', 'Receve'], optionsHi: ['Recieve', 'Receive', 'Riceive', 'Receve'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 'e9-2', subject: 'English', grade: 9, text: 'Synonym of "Candid"?', textHi: '"Candid" का पर्यायवाची?', options: ['Frank', 'Secretive', 'Shy', 'Rude'], optionsHi: ['स्पष्टवादी', 'गुप्त', 'शरमाना', 'रूखे'], correctOptionIndex: 0, difficulty: 'HARD' },
  { id: 'e9-3', subject: 'English', grade: 9, text: 'Passive voice of "She ate an apple"?', textHi: '"She ate an apple" का पैसिव वॉइस?', options: ['An apple was eaten by her', 'An apple is eaten by her', 'She was eating apple', 'Apple ate her'], optionsHi: ['An apple was eaten by her', 'An apple is eaten by her', 'She was eating apple', 'Apple ate her'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'e9-4', subject: 'English', grade: 9, text: 'Adjective form of "Gold"?', textHi: '"Gold" का विशेषण रूप?', options: ['Golden', 'Goldy', 'Goldish', 'Golder'], optionsHi: ['Golden', 'Goldy', 'Goldish', 'Golder'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'e9-5', subject: 'English', grade: 9, text: '"Break the ice" means?', textHi: '"Break the ice" का मतलब?', options: ['Freeze water', 'Start conversation', 'Break a solid', 'Get angry'], optionsHi: ['पानी जमाना', 'बातचीत शुरू करना', 'ठोस तोड़ना', 'गुस्सा होना'], correctOptionIndex: 1, difficulty: 'HARD' },

  // --- CS (Code Breaker) ---
  { id: 'cs9-1', subject: 'ComputerScience', grade: 9, text: 'Identify the error:', textHi: 'त्रुटि पहचानें:', codeSnippet: 'if x = 10:\n    print("Ten")', correctAnswer: '==', options: ['=='], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs9-2', subject: 'ComputerScience', grade: 9, text: 'Output of: 2 ** 3', textHi: 'आउटपुट क्या होगा: 2 ** 3', codeSnippet: 'print(2 ** 3)', correctAnswer: '8', options: ['8'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs9-3', subject: 'ComputerScience', grade: 9, text: 'Boolean True in numeric?', textHi: 'न्यूमेरिक में बूलियन True?', codeSnippet: 'int(True)', correctAnswer: '1', options: ['1'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs9-4', subject: 'ComputerScience', grade: 9, text: 'Data type of "Hello"?', textHi: '"Hello" का डेटा टाइप?', codeSnippet: 'type("Hello")', correctAnswer: 'str', options: ['str'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs9-5', subject: 'ComputerScience', grade: 9, text: 'Symbol for "Not Equal"?', textHi: '"Not Equal" के लिए प्रतीक?', codeSnippet: 'if x _ y:', correctAnswer: '!=', options: ['!='], correctOptionIndex: 0, difficulty: 'EASY' },

  // ================= GRADE 10 =================
  // --- Math ---
  { id: 'm10-1', subject: 'Mathematics', grade: 10, text: 'Roots of x² - 4 = 0?', textHi: 'x² - 4 = 0 के मूल?', options: ['2, -2', '4, -4', '2, 2', '-2, -2'], optionsHi: ['2, -2', '4, -4', '2, 2', '-2, -2'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'm10-2', subject: 'Mathematics', grade: 10, text: 'sin(90°)?', textHi: 'sin(90°) का मान?', options: ['0', '1', '1/2', '∞'], optionsHi: ['0', '1', '1/2', '∞'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 'm10-3', subject: 'Mathematics', grade: 10, text: 'nth term of AP?', textHi: 'AP का nवां पद?', options: ['a+(n-1)d', 'a+nd', 'a(n-1)d', '2a+n'], optionsHi: ['a+(n-1)d', 'a+nd', 'a(n-1)d', '2a+n'], correctOptionIndex: 0, difficulty: 'HARD' },
  { id: 'm10-4', subject: 'Mathematics', grade: 10, text: 'Prob. of sure event?', textHi: 'निश्चित घटना की प्रायिकता?', options: ['0', '1', '0.5', '-1'], optionsHi: ['0', '1', '0.5', '-1'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'm10-5', subject: 'Mathematics', grade: 10, text: 'Cylinder Volume Formula?', textHi: 'बेलन के आयतन का सूत्र?', options: ['πr²h', '2πrh', 'πr²', 'lbh'], optionsHi: ['πr²h', '2πrh', 'πr²', 'lbh'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'm10-6', subject: 'Mathematics', grade: 10, text: 'HCF of 26 and 91?', textHi: '26 और 91 का HCF?', options: ['13', '7', '1', '2'], optionsHi: ['13', '7', '1', '2'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'm10-7', subject: 'Mathematics', grade: 10, text: 'Discriminant of x² + 5x + 6 = 0?', textHi: 'x² + 5x + 6 = 0 का विविक्तकर?', options: ['1', '0', '25', '24'], optionsHi: ['1', '0', '25', '24'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'm10-8', subject: 'Mathematics', grade: 10, text: 'Value of tan(45°)?', textHi: 'tan(45°) का मान?', options: ['1', '0', '1/√3', '√3'], optionsHi: ['1', '0', '1/√3', '√3'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'm10-9', subject: 'Mathematics', grade: 10, text: 'Sum of first 10 natural numbers?', textHi: 'प्रथम 10 प्राकृतिक संख्याओं का योग?', options: ['55', '45', '50', '60'], optionsHi: ['55', '45', '50', '60'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'm10-10', subject: 'Mathematics', grade: 10, text: 'Coordinates of origin?', textHi: 'मूल बिंदु के निर्देशांक?', options: ['(0,0)', '(1,1)', '(0,1)', '(1,0)'], optionsHi: ['(0,0)', '(1,1)', '(0,1)', '(1,0)'], correctOptionIndex: 0, difficulty: 'EASY' },

  // --- Science ---
  { id: 's10-1', subject: 'Science', grade: 10, text: 'Formula of common salt?', textHi: 'साधारण नमक का सूत्र?', options: ['NaOH', 'HCl', 'NaCl', 'H2O'], optionsHi: ['NaOH', 'HCl', 'NaCl', 'H2O'], correctOptionIndex: 2, difficulty: 'EASY' },
  { id: 's10-2', subject: 'Science', grade: 10, text: 'Powerhouse of Cell?', textHi: 'कोशिका का पावरहाउस?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], optionsHi: ['केंद्रक', 'मिटोकॉन्ड्रिया', 'राइबोसोम', 'गोल्जी'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 's10-3', subject: 'Science', grade: 10, text: 'pH of pure water?', textHi: 'शुद्ध जल का pH?', options: ['0', '7', '14', '1'], optionsHi: ['0', '7', '14', '1'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 's10-4', subject: 'Science', grade: 10, text: 'Lens used for Myopia?', textHi: 'निकट दृष्टि दोष के लिए लेंस?', options: ['Convex', 'Concave', 'Plane', 'Cylindrical'], optionsHi: ['उत्तल', 'अवतल', 'समतल', 'बेलनाकार'], correctOptionIndex: 1, difficulty: 'HARD' },
  { id: 's10-5', subject: 'Science', grade: 10, text: 'Ozone layer protects from?', textHi: 'ओजोन परत किस से बचाती है?', options: ['Infrared', 'UV Rays', 'X-rays', 'Gamma'], optionsHi: ['इन्फ्रारेड', 'यूवी किरणें', 'एक्स-रे', 'गामा'], correctOptionIndex: 1, difficulty: 'MEDIUM' },
  { id: 's10-6', subject: 'Science', grade: 10, text: 'Which acid is in lemon?', textHi: 'नींबू में कौन सा अम्ल होता है?', options: ['Citric acid', 'Lactic acid', 'Tartaric acid', 'Acetic acid'], optionsHi: ['साइट्रिक एसिड', 'लैक्टिक एसिड', 'टार्टरिक एसिड', 'एसिटिक एसिड'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 's10-7', subject: 'Science', grade: 10, text: 'Unit of electric current?', textHi: 'विद्युत धारा का मात्रक?', options: ['Ampere', 'Volt', 'Ohm', 'Watt'], optionsHi: ['एम्पीयर', 'वोल्ट', 'ओम', 'वाट'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 's10-8', subject: 'Science', grade: 10, text: 'Which gas is evolved in photosynthesis?', textHi: 'प्रकाश संश्लेषण में कौन सी गैस निकलती है?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], optionsHi: ['ऑक्सीजन', 'कार्बन डाइऑक्साइड', 'नाइट्रोजन', 'हाइड्रोजन'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 's10-9', subject: 'Science', grade: 10, text: 'Rusting of iron is which type of change?', textHi: 'लोहे में जंग लगना किस प्रकार का परिवर्तन है?', options: ['Chemical change', 'Physical change', 'Biological change', 'Nuclear change'], optionsHi: ['रासायनिक परिवर्तन', 'भौतिक परिवर्तन', 'जैविक परिवर्तन', 'परमाणु परिवर्तन'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 's10-10', subject: 'Science', grade: 10, text: 'Metal that exists in liquid state?', textHi: 'वह धातु जो द्रव अवस्था में रहती है?', options: ['Mercury', 'Sodium', 'Gold', 'Silver'], optionsHi: ['पारा', 'सोडियम', 'सोना', 'चांदी'], correctOptionIndex: 0, difficulty: 'MEDIUM' },

  // --- English (Rapid Fire) ---
  { id: 'e10-1', subject: 'English', grade: 10, text: 'Adjective of "Circle"?', textHi: '"Circle" का विशेषण?', options: ['Circus', 'Circular', 'Circumvent', 'Circlely'], optionsHi: ['Circus', 'Circular', 'Circumvent', 'Circlely'], correctOptionIndex: 1, difficulty: 'EASY' },
  { id: 'e10-2', subject: 'English', grade: 10, text: 'Synonym of "Inevitable"?', textHi: '"Inevitable" का पर्यायवाची?', options: ['Unavoidable', 'Uncertain', 'Doubtful', 'Possible'], optionsHi: ['अपरिहार्य', 'अनिश्चित', 'संदिग्ध', 'संभव'], correctOptionIndex: 0, difficulty: 'HARD' },
  { id: 'e10-3', subject: 'English', grade: 10, text: 'One who knows everything?', textHi: 'जो सब कुछ जानता हो?', options: ['Omnipresent', 'Omniscient', 'Omnipotent', 'Optimist'], optionsHi: ['सर्वव्यापी', 'सर्वज्ञ', 'सर्वशक्तिमान', 'आशावादी'], correctOptionIndex: 1, difficulty: 'HARD' },
  { id: 'e10-4', subject: 'English', grade: 10, text: 'Antonym of "Optimistic"?', textHi: '"Optimistic" का विलोम?', options: ['Pessimistic', 'Happy', 'Hopeful', 'Positive'], optionsHi: ['निराशावादी', 'खुश', 'आशावान', 'सकारात्मक'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'e10-5', subject: 'English', grade: 10, text: 'Correct tense: "I _ him yesterday"', textHi: 'सही काल चुनें: "I _ him yesterday"', options: ['Meet', 'Met', 'Have met', 'Meeting'], optionsHi: ['Meet', 'Met', 'Have met', 'Meeting'], correctOptionIndex: 1, difficulty: 'MEDIUM' },

  // --- CS (Code Breaker) ---
  // --- CS (Code Breaker) ---
  { id: 'cs10-1', subject: 'ComputerScience', grade: 10, topicName: 'HTML', text: 'CSS property for text color?', textHi: 'टेक्स्ट कलर के लिए CSS प्रॉपर्टी?', codeSnippet: 'p { ___: red; }', correctAnswer: 'color', options: ['color'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs10-2', subject: 'ComputerScience', grade: 10, topicName: 'HTML', text: 'Correct way to link CSS?', textHi: 'CSS लिंक करने का सही तरीका?', codeSnippet: '<link rel="___" href="style.css">', correctAnswer: 'stylesheet', options: ['stylesheet'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs10-3', subject: 'ComputerScience', grade: 10, topicName: 'HTML', text: 'HTML for large heading?', textHi: 'बड़ी हेडिंग के लिए HTML?', codeSnippet: '<_>Heading</_>', correctAnswer: 'h1', options: ['h1'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs10-4', subject: 'ComputerScience', grade: 10, topicName: 'Database Concepts', text: 'Key to uniquely identify record?', textHi: 'रिकॉर्ड को विशिष्ट रूप से पहचानने के लिए कुंजी?', codeSnippet: 'PRIMARY ____', correctAnswer: 'KEY', options: ['KEY'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs10-5', subject: 'ComputerScience', grade: 10, topicName: 'Database Concepts', text: 'SQL cmd to get data?', textHi: 'डेटा प्राप्त करने के लिए SQL कमांड?', codeSnippet: '_ * FROM Users', correctAnswer: 'SELECT', options: ['SELECT'], correctOptionIndex: 0, difficulty: 'MEDIUM' },
  { id: 'cs10-6', subject: 'ComputerScience', grade: 10, topicName: 'HTML', text: 'Image tag attribute for path?', textHi: 'पथ के लिए छवि टैग विशेषता?', codeSnippet: '<img ___="image.jpg">', correctAnswer: 'src', options: ['src'], correctOptionIndex: 0, difficulty: 'EASY' },
  { id: 'cs10-7', subject: 'ComputerScience', grade: 10, topicName: 'Database Concepts', text: 'SQL cmd to update data?', textHi: 'डेटा अपडेट करने के लिए SQL कमांड?', codeSnippet: '____ Users SET name="A"', correctAnswer: 'UPDATE', options: ['UPDATE'], correctOptionIndex: 0, difficulty: 'HARD' },
  { id: 'cs10-8', subject: 'ComputerScience', grade: 10, topicName: 'HTML', text: 'Unordered list tag?', textHi: 'अनुक्रमित सूची टैग?', codeSnippet: '<__><li>Item</li></__>', correctAnswer: 'ul', options: ['ul'], correctOptionIndex: 0, difficulty: 'EASY' },
];

// Helper to get/set mock DB from local storage
const getMockDB = () => {
  try {
    const stored = localStorage.getItem('neurolearn_mock_db');
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("LS Error", e);
    return {};
  }
};

const saveMockDB = (db) => {
  try {
    localStorage.setItem('neurolearn_mock_db', JSON.stringify(db));
  } catch (e) {
    console.error("LS Save Error", e);
  }
};

// Helper for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async login(username, password) {
    if (USE_MOCK) {
      await delay(500);
      const db = getMockDB();
      const user = Object.values(db).find(s => s.username === username && s.password === password);

      if (user) return user;

      // Auto-create test user if missing
      if (username === 'test') {
        const testUser = { id: 'test', username: 'test', gradeLevel: '6', masteryScores: {}, attempts: [] }; // Default to class 6 for debugging content
        db['test'] = testUser;
        saveMockDB(db);
        return testUser;
      }
      throw new Error("Invalid credentials");
    }
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async register(username, password, grade) {
    if (USE_MOCK) {
      await delay(500);
      const db = getMockDB();

      if (db[username]) {
        throw new Error("Username already taken");
      }

      const newUser = {
        id: Math.random().toString(),
        username,
        password,
        gradeLevel: Number(grade),
        masteryScores: {},
        attempts: [],
        coins: 100, // Sign-up bonus!
        inventory: ['default'],
        equippedAvatar: 'default'
      };

      db[username] = newUser;
      saveMockDB(db);
      return newUser;
    }
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, grade }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  async getTopics() {
    if (USE_MOCK) {
      await delay(500);
      return mockTopics;
    }
    const res = await fetch(`${API_URL}/topics`);
    return res.json();
  },

  async getTopic(id) {
    if (USE_MOCK) {
      await delay(300);
      return mockTopics.find(t => t.id === id);
    }
    const res = await fetch(`${API_URL}/topics/${id}`);
    return res.json();
  },

  async generateQuiz(topicId, studentId) {
    if (USE_MOCK) {
      await delay(800);

      const db = getMockDB();
      // Find user to check Grade Level
      const user = Object.values(db).find(u => u.id === studentId);
      const userGrade = user ? Number(user.gradeLevel) : 8; // Default to 8

      // Identify Subject from Topic
      const topic = mockTopics.find(t => t.id === topicId);
      const subject = topic ? topic.subject : null;
      const exactTopicName = topic ? topic.name : null;

      // Filter Questions by Subject AND Grade AND Topic if available
      let relevantQuestions = mockQuestions.filter(q => {
        const subjectMatch = subject ? q.subject === subject : true;
        const gradeMatch = q.grade === userGrade;
        // Strict topic match if question has topicName tag
        const topicMatch = (q.topicName && exactTopicName) ? q.topicName === exactTopicName : true;

        return subjectMatch && gradeMatch && topicMatch;
      });

      // Fallback: If no strict grade match, try +/- 1 grade, or just Subject
      if (relevantQuestions.length === 0 && subject) {
        relevantQuestions = mockQuestions.filter(q => q.subject === subject);
      }

      // Fallback: If still nothing, Generic fallback to avoid crash
      if (relevantQuestions.length === 0) {
        relevantQuestions = [
          { id: 'gen1', text: 'Sample Question (No specific data found)', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, difficulty: 'EASY' }
        ];
      }

      // Shuffle and Return
      const shuffled = [...relevantQuestions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    }
    const res = await fetch(`${API_URL}/quiz/generate?topicId=${topicId}&studentId=${studentId}`);
    return res.json();
  },

  async submitQuiz(payload) {
    if (USE_MOCK) {
      await delay(800);
      const total = Object.keys(payload.answers).length;
      let correctCount = 0;

      // Helper to find question even if implied from fallback
      const allQs = [...mockQuestions, { id: 'gen1', correctOptionIndex: 0 }];

      for (const [qId, optIdx] of Object.entries(payload.answers)) {
        const q = allQs.find(mq => mq.id === qId);
        if (q && q.correctOptionIndex === optIdx) correctCount++;
      }

      const score = total === 0 ? 0 : (correctCount / total) * 100;

      const attempt = {
        id: Math.random().toString(),
        topicId: payload.topicId,
        score: score,
        totalQuestions: total,
        correctAnswers: correctCount,
        timestamp: new Date().toISOString()
      };

      // PERSIST MOCK DATA to LocalStorage
      const db = getMockDB();
      // Find user by studentId (scan all users)
      const userKey = Object.keys(db).find(key => db[key].id === payload.studentId);

      if (userKey) {
        const student = db[userKey];
        if (!student.attempts) student.attempts = [];
        if (!student.masteryScores) student.masteryScores = {};

        student.attempts.push(attempt);

        const earnedCoins = correctCount * 50;
        student.coins = (student.coins || 0) + earnedCoins;
        attempt.earnedCoins = earnedCoins;

        const currentMastery = student.masteryScores[payload.topicId] || 0;
        if (score > currentMastery) {
          student.masteryScores[payload.topicId] = score;
        }
        saveMockDB(db);
      }

      return attempt;
    }
    const res = await fetch(`${API_URL}/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getStudent(id) {
    if (USE_MOCK) {
      await delay(500);
      const db = getMockDB();
      const student = Object.values(db).find(s => s.id === id);
      // Ensure old users have new fields
      if (student) {
        if (student.coins === undefined) student.coins = 0;
        if (!student.inventory) student.inventory = ['default'];
        if (!student.equippedAvatar) student.equippedAvatar = 'default';
      }
      return student || { id, username: 'Student', gradeLevel: 8, masteryScores: {}, attempts: [], coins: 0, inventory: ['default'], equippedAvatar: 'default' };
    }
    const res = await fetch(`${API_URL}/students/${id}`);
    return res.json();
  },

  async updateUserData(userId, updates) {
    if (USE_MOCK) {
      await delay(300);
      const db = getMockDB();
      const userKey = Object.keys(db).find(key => db[key].id === userId);
      if (userKey) {
        db[userKey] = { ...db[userKey], ...updates };
        saveMockDB(db);
        return db[userKey];
      }
      throw new Error("User not found");
    }
    // Real backend implementation would go here
  }
};
