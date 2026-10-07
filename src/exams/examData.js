export const examProducts = [
  {
  id: "grade6-2017-english",
  grade: "Grade 6",
  subject: "English",
  title: "Grade 6 2018 English Ministry Exam",
  price: 65,
  description:
    "Practice the 2018 Grade 6 English Ministry Exam with the original passage, questions, answers and explanations.",
  active: true,
  questions: [
    {
      id: "g6english-1",
      order: 1,
      passage: `Technology has changed education in many ways. In the past, students only had books and teachers to help them leam Today, technology allows students to access information faster and in more creative ways. Students can use computers, tablets, and the intemet to find answers to their questions or watch videos that explain complex topics. Teachers can also use technology to create more engaging lessons. This makes learning more fun and effective for everyone.

Students can learn in many different places now, not just in the classroom. With the help of technology, students can attend online classes, watch educational videos, and take part in virtual study groups. This is very helpful when students cannot go to school, for example, during school closures or when they are sick. Technology also allows. students to stay connected with their teachers and classmates through emails, video calls, and online chats, making leaming flexible accessible.

Technology also helps students become more independent leamers Instead of waiting for a teacher to explain something, they can search for answers on their own. Many students also use educational apps and websites to help them practice skills like math or learn new languages. This ability to work independently helps students become more confident in their learning.

However, it is important that students use technology in a balanced wav Spending too much time online can affect their health and social life. It's essential for students to make time for outdoor activities, exercise, and spending time with friends and family Teachers and parents can guide students in using technology for learning purposes and not just for entertainment. Finally, while technology is a powerful tool for education, students should learn to use it responsibly They should avoid distractions such as social media or games during study time. Technology can be very useful, but it is up to students to use it wisely to get the most out of it.`,

      question: "What is the main message of the above passage?",
      options: [
        "Technology makes learning easier",
        "Technology replaces teachers.",
        "Technology makes school boring",
        "Technology is only for fun."
      ],
      correctAnswer: "Technology makes learning easier",
      explanation:
        'The passage describes how technology allows students to access information faster. It mentions that technology makes learning more "effective for everyone". It emphasizes that technology helps students become more independent and confident in their learning.'
    },

    {
      id: "g6english-2",
      order: 2,
      
      question: "How does technology help students learn?",
      options: [
        "By replacing teachers in class.",
        "By offering entertainment and games.",
        "By making school work harder.",
        "By helping students search for information."
      ],
      correctAnswer: "By helping students search for information",
      explanation:
        "The text states students can use computers and the internet to find answers to their questions. It notes that students can search for answers on their own instead of waiting for a teacher. Technology also provides access to videos that explain complex topics."
    },

    {
      id: "g6english-3",
      order: 3,
      
      question: "Why is it important for students to use technology responsibly?",
      options: [
        "To use social media for playing games.",
        "To avoid distractions and health issues.",
        "To spend more time online.",
        "To stop learning in school."
      ],
      correctAnswer: "To avoid distractions and health issues",
      explanation:
        'The passage warns that spending too much time online can affect health and social life. It advises students to avoid distractions like social media or games during study time. Using technology responsibly ensures students get the most out of this "powerful tool".'
    }
  ]
},
  {
  id: "grade6-2018-science",
  grade: "Grade 6",
  subject: "አካባቢ ሳይንስ",
  title: "Grade 6 2018 አካባቢ ሳይንስ Ministry Exam",
  price: 65,
  description:
    "Practice the 2018 Grade 6 አካባቢ ሳይንስ Ministry Exam with answers and explanations.",
  active: true,
  questions: [
    {
      id: "g6science2018-1",
      order: 1,
      question:
        "የኢትዮጵያ ፍጹማዊ መገኛ የሆነው የትኛው ነው?",
      options: [
        "ሀ. ከ3° ሰሜን እስከ 15° ሰሜን ኬክሮስ እና ከ33° ምሥራቅ እስከ 48° ምሥራት ኬንትሮስ።",
        "ለ. ከ0° ሰሜን እስከ 12° ሰሜን ኬክሮስ እና ከ30° ምሥራቅ እስከ 45° ምሥራቅ ኬንትሮስ።",
        "ሐ. ከ5° ሰሜን እስከ 20° ሰሜን ኬክሮስ እና ከ25° ምሥራቅ እስከ 50° ምሥራቅ ኬንትሮስ።",
        "መ. ከ10° ሰሜን እስከ 18° ሰሜን ኬክሮስ እና ከ35° ምሥራቅ እስከ 55° ምሥራቅ ኬንትሮስ።"
      ],
      correctAnswer: "ሀ",
      explanation:
        "ፍጹማዊ መገኛ የሚገለፀው በኬክሮስ (Latitude) እና በኬንትሮስ (Longitude) መስመሮች ነው። ኢትዮጵያ በምስራቅ አፍሪካ የምትገኝ ሲሆን መገኛዋም ከ3-15° ሰሜን እና 33-48° ምስራት ነው።"
    },

    {
      id: "g6science2018-2",
      order: 2,
      question:
        "ከሚከተሉት ውስጥ የትኛው ሀገር ከኢትዮጵያ ጋር ድንበር ይጋራል?",
      options: [
        "ሀ. ኡጋንዳ",
        "ለ. ታንዛኒያ",
        "ሐ. ኤርትራ",
        "መ. ሩዋንዳ"
      ],
      correctAnswer: "ሐ",
      explanation:
        "ኢትዮጵያ በየብስ ከኤርትራ፣ ከጅቡቲ፣ ከሶማሊያ፣ ከኬንያ፣ ከደቡብ ሱዳን እና ከሱዳን ጋር ትዋሰናለች። ኤርትራ በሰሜን በኩል የኢትዮጵያ አጎራባች ሀገር ናት።"
    },

    {
      id: "g6science2018-3",
      order: 3,
      question:
        "ተማሪ ፀጋዬ ኬክሮስ 9° ሰሜን እና ኬንትሮስ 39° ምስራቅ በመጠቀም በኢትዮጵያ ካርታ ላይ የትኛውን ቦታ እንደሚያሳይ ይገመታል?",
      options: [
        "ሀ. አዲስ አበባ",
        "ለ. ላሊበላ ቤተክርስቲያን",
        "ሐ. ሰሜናዊ ተራሮች",
        "መ. ግድብ ላይ ያለ ፓርክ"
      ],
      correctAnswer: "ሀ",
      explanation:
        "የአዲስ አበባ ትክክለኛ መገኛ 9° ሰሜን ኬክሮስ እና 38° እስከ 39° ምስራቅ ኬንትሮስ አካባቢ ነው። ይህ መገኛ የሀገሪቱን መሀል ማሳያ ነው።"
    }
  ]
},
  {
  id: "grade6-2016-civics",
  grade: "Grade 6",
  subject: "ግብረ ገብ",
  title: "Grade 6 2016 ግብረ ገብ Ministry Exam",
  price: 65,
  description:
    "Practice the 2016 Grade 6 ግብረ ገብ Ministry Exam with answers and explanations.",
  active: true,
  questions: [
    {
      id: "g6civics-1",
      order: 1,
      question:
        "ከሚከተሉት ዓረፍተ ነገሮች ‘ምሉዕነትን’ በይበልጥ የሚገልጸው የትኛው ነው?",
      options: [
        "ሀ. ሰዎች የሌሎች ሰዎችን መሰረታዊ እምነትና ድርጊት ሲቀበሉና ሲተገብሩ",
        "ለ. ሰዎች ስለ ነገሮች ባላቸው ግላዊ እምነት ቋሚ አመለካከትን ሲያንጸባርቁ",
        "ሐ. ሰዎች የራሳቸውን መሰረታዊ እምነት በሌሎች ሰዎች ላይ መጫን ሲችሉ",
        "መ. ሰዎች ስለነገሮች ባላቸው ግላዊ እምነት ተለዋዋጭ አቋምን ሲያሳዩ"
      ],
      correctAnswer: "ለ",
      explanation:
        "ምሉዕነት ማለት አንድ ሰው ትክክል ነው ብሎ በሚያምንበት የሞራል መርህ ላይ ጸንቶ መቆም ነው። ምሉዕነት ያለው ሰው በግላዊ እምነቱ ላይ ቋሚና የማይለዋወጥ አቋም ይኖረዋል።"
    },
    {
      id: "g6civics-2",
      order: 2,
      question:
        "ከሚከተሉት አንዱ ምሉዕነት የተላበሱ ግለሰቦች ባህሪ ነው፡፡ የትኛው ነው?",
      options: [
        "ሀ. የሰሩትን ስህተት በእራሳቸው መቀበል ይችላሉ",
        "ለ. ሌሎች የተሳሳተ ድርጊት ሲፈጽሙ በዝምታ ይመለከታሉ",
        "ሐ. የፈጸሟቸውን ድርጊቶች በአጽንኦት መገምገም ይቸገራሉ",
        "መ. ውስጣዊ እምነታቸውን በማይገልጽ ተግባር ላይ ይሳተፋ"
      ],
      correctAnswer: "ሀ",
      explanation:
        "ምሉዕነት ያለው ሰው በድርጊቱ ታማኝና ግልጽ ስለሚሆን የሰራውን ስህተት አምኖ ለመቀበል አይፈራም። ይህም ለራስና ለሌሎች ታማኝ የመሆን መገለጫ ነው።"
    },
    {
      id: "g6civics-3",
      order: 3,
      question:
        "	እውነተኛ የግብረ ገብ ምሉዕነት የተላበሱ ሰዎች ባህሪ የሆነው የትኛው ነው?",
      options: [
        "ሀ. በዙሪያቸው ካሉ ሰዎች ጋር ያላቸውን ግንኙነት ተገቢውን ዋጋ አይሰጡም",
        "ለ. የሌሎች ሰዎችን ሚስጥሮች ለሌሎች አሳልፈው ይሰጣሉ",
        "ሐ. በማንኛውም ሁኔታ ውስጥ ቢሆኑም እውነትን ይናገራሉ",
        "መ. በሌሎች ላይ ጉዳት የሚያስከትል ነገር ሲመለከቱ አይቃወሙ”"
      ],
      correctAnswer: "ሐ",
      explanation:
        "እውነተኛ ምሉዕነት ያላቸው ሰዎች በማንኛውም አስቸጋሪ ሁኔታ ውስጥ ቢሆኑ እንኳን ለእውነት ቅድሚያ ይሰጣሉ ።ውሸትንና ማታለልን አጥብቀው ይቃወማሉ ።"
    }
  ]
},
{
  id: "grade6-2016-science",
  grade: "Grade 6",
  subject: "አካባቢ ሳይንስ",
  title: "Grade 6 2016 አካባቢ ሳይንስ Ministry Exam",
  price: 65,
  description:
    "Practice the 2016 Grade 6 አካባቢ ሳይንስ Ministry Exam with answers and explanations.",
  active: true,
  questions: [
    {
      id: "g6science-2016-1",
      order: 1,
      question:
        "የአቡሽ አባት ለስራ ጉዳይ ከአዲስ አበባ ወደ ስዋዚላንድ (ደቡብ አፍሪካ ቀጠና) ቢሄዱ ወደ ኢትዮጵያ ሲመለሱ ወዴት አቅጣጫ ይጓዛሉ?",
      options: [
        "ሀ. ወደ ምዕራብ",
        "ለ. ወደ ሰሜን",
        "ሐ. ወደ ምስራቅ",
        "መ. ወደ ደቡብ",
      ],
      correctAnswer: "ለ",
      explanation:
        "ስዋዚላንድ (ኤስዋቲኒ) ከኢትዮጵያ አንጻር በደቡብ አቅጣጫ ትገኛለች:: ስለዚህ ከአንድ ደቡብ ካለ ሀገር ወደ ሰሜን ወደሚገኝ ሀገር (ኢትዮጵያ) ለመመለስ ወደ ሰሜን አቅጣጫ መጓዝ ያስፈልጋል፡፡",
    },

    {
      id: "g6science-2016-2",
      order: 2,
      question:
        "የምስራቅ አፍሪካ ካርታን ንደፍ ለማሳየት ኬንያ ከኤርትራ አንጻር በየት በኩል ሊቀመጥ ይችላል?",
      options: [
        "ሀ. በደቡብ አቅጣጫ",
        "ለ. በምዕራብ አቅጣጫ",
        "ሐ. በሰሜን አቅጣጫ",
        "መ. በምስራቅ አቅጣጫ",
      ],
      correctAnswer: "ሀ",
      explanation:
        "ኤርትራ በምስራቅ አፍሪካ ሰሜናዊ ጫፍ ላይ የምትገኝ ሲሆን፣ ኬንያ ደግሞ ከኤርትራ በስተደቡብ ትገኛለች::",
    },

    {
      id: "g6science-2016-3",
      order: 3,
      question:
        "ዜሮ ዲግሪ (0º) አግድም መስመር (ኢኩዌተር) በአፍሪካ ካርታ ላይ ቢሰመር የትኛውን የምስራቅ አፍሪካ ሃገር ያቋርጣል?",
      options: [
        "ሀ. ኤርትራ",
        "ለ. ዛምቢያ",
        "ሐ. ደቡብ ሱዳን",
        "መ. ኬንያ",
      ],
      correctAnswer: "መ",
      explanation:
        "የምድር ወገብ (Equator) ወይም የ0 ዲግሪ አግድም መስመር የምስራቅ አፍሪካ ሀገራት የሆኑትን ኬንያን፤ ዩጋንዳንና ሶማሊያን ያቋርጣል፡፡",
    },
  ],
},
    
    {
  id: "grade6-2016-english",
  grade: "Grade 6",
  subject: "english",
  title: "Grade 6 2016 english Ministry Exam",
  price: 65,
  description:
    "Practice the 2016 Grade 6 english Ministry Exam with answers and explanations.",
  active: true,
  questions: [
    {
      id: 1,
      order: 1,
      passage:`Healthy Drinks

Drinking healthy beverages is just as important as eating healthy foods. Water is the best drink for our bodies because it keeps us hydrated and helps our organs work properly. It is important to drink plenty of water throughout the day, especially when we are playing or being active.

Another healthy drink option is milk. Milk is rich in Calcium, which helps us have strong bones and teeth. It also provides us with protein and vitamins. Sometimes we may want something more sweetly. In this case, we can choose 100% fruit juice. Fruit juice contains natural sugars and vitamins`
,
      question: "What is the best drink for our body?",
      options: [
        "A.	Milk",
        "B.	Juice",
        "C.	Water",
        "D.	Beer"
      ],
      correctAnswer: "C",
      explanation: "The passage explicitly states that “Water is the best drink for our bodies” because it keeps the body hydrated and helps organs work properly."
    },
    {
      id: 2,
      order: 2,
      question: "	When do we need to drink water?",
      options: [
        "A.	When we sleep",
        "B.	When we exercise",
        "C.	When we eat",
        "D.	When we sit"
      ],
      correctAnswer: "B",
      explanation: "The text mentions that it is important to drink water especially when “playing or being active,” which is synonymous with exercising."
    },
    {
      id: 3,
      order: 3,
      question: "How many healthy drinks are told in the passage?",
      options: [
        "A.	One",
        "B.	Two",
        "C.	Three",
        "D.	Four"
      ],
      correctAnswer: "C",
      explanation: "The passage describes three specific healthy options: water, milk, and 100% fruit juice."
    }
  ]
},
  {
  id: "grade6-2016-amharic",
  grade: "Grade 6",
  subject: "አማርኛ",
  title: "Grade 6 2016 አማርኛ Ministry Exam",
  price: 65,
  description:
    "Practice the 2016 Grade 6 አማርኛ Ministry Exam with answers and explanations.",
  active: true,
  questions: [
    {
      id: 1,
      order: 1,
      question: "“ጽሞና” በአውድ ሲተረጎም ትክክለኛው ትርጉም የቱ ነው?",
      options: [
        "ሀ. ደስታ",
        "ለ. ሀዘን",
        "ሐ. ድካም",
        "መ. ጸጥታ"
      ],
      correctAnswer: "መ",
      explanation: "“ጽሞና” ማለት ጸጥታ ወይም ሰላም ማለት ነው።"
    },
    {
      id: 2,
      order: 2,
      question: "“ቆረጡ” የሚለው ቃል በአውዱ ሲተረጎም ምን ማለት ነው?",
      options: [
        "ሀ. ተመለከቱ",
        "ለ. ወሰኑ",
        "ሐ. ተዉ",
        "መ. ጀመሩ"
      ],
      correctAnswer: "ለ",
      explanation: "በዚህ አውድ “ቆረጡ” ማለት “ወሰኑ” ማለት ነው።"
    },
    {
      id: 3,
      order: 3,
      question: "“በኢትዮጵያም” በትክክል የተከፋፈለው የቱ ነው?",
      options: [
        "ሀ. በ-ኢትዮጵያ-ም",
        "ለ. በኢ-ትዮጵያ-ም",
        "ሐ. በ-ኢትዮጵያም",
        "መ. በኢትዮጵያ-ም"
      ],
      correctAnswer: "ሀ",
      explanation: "“በኢትዮጵያም” በ-ኢትዮጵያ-ም ተብሎ ይከፋፈላል።"
    }
  ]
},
  {
  id: "grade6-amharic",
  grade: "Grade 6",
  subject: "አማርኛ",
  title: "Grade 6 2018 አማርኛ Ministry Exam",
  price: 65,
  description:
    "Practice the 2018 Grade 6 አማርኛ Ministry Exam with the original passages, questions, answers and explanations.",
  active: true,
  questions: [
    {
      id: "g6amharic-1",
      order: 1,
      passage: `ምንባብ እንድ

ከዕለታት አንድ ቀን ፍሬው እንደተሸለቀቀበት የበቶለ‐ አገዳ ጥውልግ ብዬ አክስቴን ልጠይቃት ሄድሁ። አክስቴ የሺሀረግ አለማሁ ትባላለች፡፡ ሲበዛ ቅን፤ የመስጠት ጌታ ናት፡፡ ቤቷ ጭንቁርቁስ ያለ፤ ዕቃዎቿ ቢሽጡ ቢለወጡ ከጥቂት ብሮች የማይበልጡ ናቸው። እክስቴ የሺሀረግ ፊቷ ግን ብርት ያለ ነው፤ ሰላም የሰፈነበት፡፡ ዐይኗ በቅንነት የተሞላ። እዚህ ቤት’ ብዬ ጠዋት ተከፍቶ ማታ የሚዘጋውን በሯን አልፌ ገባሁ፡፡ “ኧረ ወይ ለሊቱ - ፍቅሩ?”

“እክስቴ! እኔ ነኞ አልኳት፡፡ አገላብጣ ስማኝ! እኔ አፈር ልሁን አንተማ አይደለህም! ጥቁርቁር ብለህ፤ አመድህ ቡን ብሎ ብላ እቅፍ አደረገች’ዩ፡ መታቀፍ መድኃኒት መሆኑን ያወቅሁት ያኔ ነው፤ እክስቴ የሺሀረግ ዕንባዋን በነጠላዋ እየጠረገች አጠገቤ ቁጭ አለች፡፡ ትከሻዋ ላይ ራሴን ደገፍ አድርጌ በሁለት እጆቹ አቀፍኋት፡፡ ፍቅሯ፣ ሰላሟ ከሞቃት ወደ ቀዝቃዛ እንደሚፈስ ውሃ በመላ ሰውነቴ ሲፈስ ይሰማኛል። ከዚያ ቆይ እንድ ጊዜ ብላኝ በስሎ የሚንፈቀፈቀውን ድንች ከጣደችበት ምድጃ አወጣችና ዳታን ላይ እንጀራና እዋዜ አድርጋ አቀረበችው፡፡ በስስት ዐይን ዐይኔን እያየች ወዲያው ወዲያው እየላጠች እጎረሰችኝ።...`,

      question:
        "በምንባቡ መሰረት “ጥውልግ ብዬ” የሚለው ሀረግ አውዳዊ ፍቺው ምንድነው?",
      options: ["ደክሜ", "ታምሜ", "ሰንፌ", "ወድቄ"],
      correctAnswer: "ደክሜ",
      explanation:
        "በምንባቡ ውስጥ “ጥውልግ ብዬ” የሚለው ሀረግ በድካም ምክንያት መዛልንና አቅም ማጣትን ይገልጻል።",
    },

    {
      id: "g6amharic-2",
      order: 2,
      

      question:
        "በምንባቡ ውስጥ “ዳታን” የሚለው ቃል አውዳዊ ፍቺው ምንድነው?",
      options: ["ጠረጴዛ", "ምጣድ", "ትሪ", "ድስት"],
      correctAnswer: "ትሪ",
      explanation:
        "“ዳታን ላይ እንጀራና አዋዜ” ተብሎ ምግብ የቀረበበት ዕቃ ስለሆነ አውዳዊ ፍቺው “ትሪ” ነው።",
    },

    {
      id: "g6amharic-3",
      order: 3,
      

      question:
        "ከላይ የቀረበው ምንባብ ዋነኛ መልዕክቱ (ጭብጡ) ምንድነው?",
      options: [
        "ስስት",
        "የመታቀፍ መድኃኒትነት",
        "መጎሳቆል",
        "የቤተሰብ ፍቅር",
      ],
      correctAnswer: "የቤተሰብ ፍቅር",
      explanation:
        "ምንባቡ በዋናው ገጸ-ባህሪ እና በአክስቱ መካከል ያለውን ጠበቀ ትስስር፣ መተሳሰብና ጥልቅ ፍቅር ያሳያል።",
    },
  ],
},
  {
    id: "grade6-mathematics",
    grade: "Grade 6",
    subject: "Mathematics",
    title: "Grade 6 Mathematics Exam Practice",
    price: 65,
    description:
      "Practice Grade 6 Mathematics questions with answers and explanations.",
    active: true,
    questions: [
      {
        id: "g6math-1",
        order: 1,
        question: "የጎን ርዝመቱ 4ሜ ወርዱ 5ሜ የሆነ ሬክታንግል ስፋቱ ስንት ነው?",
        options: ["16 ካሬ ሜትር", "12 ካሬ ሜትር", "20 ካሬ ሜትር", "24 ካሬ ሜትር"],
        correctAnswer: "20 ካሬ ሜትር",
        explanation: "የአራት ማዕዘን ስፋት = ርዝመት × ስፋት = 4 × 5 = 20 ካሬ ሜትር።",
      },
      {
        id: "g6math-2",
        order: 2,
        question: "3 ሜ³ ስንት ሊትር ነው?",
        options: ["3000 ሊትር", "300 ሊትር", "30 ሊትር", "30000 ሊትር"],
        correctAnswer: "3000 ሊትር",
        explanation: "1 ሜ³ = 1000 ሊትር። ስለዚህ 3 × 1000 = 3000 ሊትር።",
      },
      {
        id: "g6math-3",
        order: 3,
        question: "ከሚከተሉት ንፅፅሮች ትክክለኛ የሁነው የቱ ነው? ",
        options: [
          "2/3 = 4/9",
          "1/2 < 1/3",
          "4/3 > 5/3",
          "1/5 = 3/15",
        ],
        correctAnswer: "1/5 = 3/15",
        explanation: "1/5 እና 3/15 ተመጣጣኝ ክፍልፋዮች ናቸው።",
      },
    ],
  },

  {
    id: "grade6-english",
    grade: "Grade 6",
    subject: "English",
    title: "Grade 6 English Exam Practice",
    price: 65,
    description:
      "Practice Grade 6 English questions with answers and explanations.",
    active: true,
    
    questions: [
      {
        id: "g6eng-1",
        order: 1,
        passage: `Effective Study Skills
1 Effective study skills are essential for students to succeed in their academic pursuits. Developing good study habits starts with setting clear goals and creating a structured schedule. When students know what they need to learn and when they need to complete their tasks, they can manage their time more efficiently.
2 It is also important to find a quiet, comfortable place to study where distractions are minimized. This helps students stay focused and retain information better. Additionally, active learning techniques such as taking notes, summarizing key points, and teaching the material to someone else can greatly enhance understanding and memory.
3 Another key aspect of study skills is the use of different learning methods to suit individual needs. Some students may benefit from visual aids like diagrams or charts, while others may prefer listening to lectures or reading textbooks. It is important to experiment with various techniques to find what works best for each person. Regular review and practice are also crucial. Revisiting material periodically helps reinforce learning and prevents information from being forgotten.
Using flashcards, practice tests, and self-quizzing can make review more effective and engaging.
4 Finally, maintaining a healthy lifestyle is an important part of developing strong study skills. Adequate sleep, proper nutrition, and regular exercise contribute to better concentration and overall well-being. Students who take care of their physical and mental health are more likely to stay motivated and perform well in their studies. By combining effective study strategies with a balanced lifestyle, students can achieve their academic goals and build a foundation for lifelong learning.`,
        question:
          "According to the passage, which one of the following is Not Correct?",
        options: [
          "Developing good study habits starts with setting clear goals.",
          "A healthy life style is part of effective study skills.",
          "Effective study skills include finding a quiet and comfortable place.",
          "Distractions are parts of effective study skills.",
        ],
        correctAnswer: "Distractions are parts of effective study skills.",
        explanation:
          "The passage says that distractions should be minimized because a quiet place helps students stay focused. Therefore, distractions are not a part of effective study skills.",
      },
      {
        id: "g6eng-2",
        order: 2,
        question:
          "In the passage, which one is not mentioned as an active learning method?",
        options: [
          "Taking notes",
          "Simply listening to the teacher",
          "Teaching materials to other people",
          "Summarizing key points",
        ],
        correctAnswer: "Simply listening to the teacher",
        explanation:
          "The passage specifically mentions taking notes, summarizing key points, and teaching the material to someone else. Simply listening to the teacher is not mentioned as an active learning technique.",
      },
      {
        id: "g6eng-3",
        order: 3,
        question: "What is the main idea of paragraph 2?",
        options: [
          "The use of different suitable learning methods",
          "The importance of revisiting learning materials",
          "The importance of setting goals and studying schedule",
          "The importance of finding quiet and appropriate place to study",
        ],
        correctAnswer:
          "The importance of finding quiet and appropriate place to study",
        explanation:
          "Paragraph 2 explains the importance of having a quiet, comfortable place with fewer distractions. It also explains how this improves concentration and memory.",
      },
    ],
  },
  {
    id: "grade6-civics",
    grade: "Grade 6",
    subject: "ግብረ ገብ",
    title: "Grade 6 ግብረ ገብ Exam Practice",
    price: 65,
    description:
      "Practice Grade 6 ግብረ ገብ questions with answers and explanations.",
    active: true,
    questions: [
      {
        id: "g6civics-1",
        order: 1,
        question: "ሠላም ለሃገር ምን ጠቀሜታ ይኖረዋል?",
        options: [
          "ጠንካራና የበለጸገች ሃገር ይፈጥራል",
          "በሁከት የተሞላች ሃገር ይፈጥራል",
          "ኋላ ቀር ማኅበረሰብ እንዲፈጠር ያግዛል",
          "ጥገኛና ተረጅ ሃገር እንዲኖር ያደርጋል",
        ],
        correctAnswer: "ጠንካራና የበለጸገች ሃገር ይፈጥራል",
        explanation:
          "በአንድ ሀገር ውስጥ ሰላም ሲሰፍን ዜጎች በነፃነት ሰርተው ለመለወጥ እድል ያገኛሉ፤ ይህም ማህበራዊና ኢኮኖሚያዊ እድገትን በማምጣት ጠንካራና የበለጸገች ሀገር ለመገንባት መሰረት ይሆናል፡፡",
      },
      {
        id: "g6civics-2",
        order: 2,
        question: "በስሜት ውስጥ የሚወሰድ አሉታዊ የኃላፊነት ውጤት የትኛው ነው?",
        options: [
          "ሽልማት መቀበል",
          "እምነት መጨመር",
          "ክብርን መጎናጸፍ",
          "ሌሎችን መጉዳት",
        ],
        correctAnswer: "ሌሎችን መጉዳት",
        explanation:
          "አንድ ሰው በንዴት ወይም ባልተረጋጋ ስሜት ውስጥ ሆኖ ውሳኔዎችን ሲያስተላልፍና እርምጃዎችን ሲወስድ ኃላፊነት የጎደለው ተግባር ስለሚሆን ራሱንም ሆነ ሌሎችን ሰዎችን ለጉዳት ይዳርጋል፡፡",
      },
      {
        id: "g6civics-3",
        order: 3,
        question:
          "ከሚከተሉት ውስጥ የትኛው በሠላምና በሃገር ዕድገት መካከል ያለውን ትስስር ያሳያል?",
        options: [
          "ሠላም ሲኖር ልማት፤ አንድነት እና ዕድገት ይጠናክራል",
          "ሠላም ቢኖርም ባይኖርም በልማት ላይ ምንም ለውጥ የለውም",
          "ሰዎች ሰላምን ባያስጠብቁም ልማትን በቀላሉ ሊያመጡ ይችላሉ",
          "ሠላም የሚጠቅመው ግለሰቦችን እንጅ ሀገርን አይደለም",
        ],
        correctAnswer:
          "ሠላም ሲኖር ልማት፤ አንድነት እና ዕድገት ይጠናክራል",
        explanation:
          "ሰላምና ልማት የማይነጣጠሉ ጽንሰ-ሀሳቦች ናቸው፣ ሀገር ሰላም ስትሆን የዜጎች አንድነት ይጠነክራል፣ የልማት ስራዎች ያለምንም እንቅፋት ይከናወናሉ፤ ይህም ሀገራዊ እድገትን ያፋጥናል፡፡",
      },
    ],
  },
  {
    id: "grade6-science",
    grade: "Grade 6",
    subject: "አካባቢ ሳይንስ",
    title: "Grade 6 አካባቢ ሳይንስ Exam Practice",
    price: 65,
    description:
      "Practice Grade 6 አካባቢ ሳይንስ questions with answers and explanations.",
    active: true,
    questions: [
      {
        id: "g6science-1",
        order: 1,
        question:
          "ለማ ለጓደኛው ሀይሌ ያለበትን ቦታ ከወዳጅነት ፓርክ  በስተደቡብ እገኛለሁ በማለት በስልክ ነገረው:: ይህ አይነቱ የመገኛ አገላለፅ ምን ይባላል?",
        options: ["ግምታዊ", "አንፃራዊ", "ፍፁማዊ", "የካርታ"],
        correctAnswer: "አንፃራዊ",
        explanation:
          "አንፃራዊ መገኛ አንድን ቦታ ከሌላ ቦታ ጋር በማዛመድ የሚገልጽ ነው።",
      },
      {
        id: "g6science-2",
        order: 2,
        question:
          "ከሚከተሉት ሀገራት ውስጥ የኢትዮጵያ አጎራባች የሆነችው የትኛዋ ናት?",
        options: ["ብሩንዲ", "ሩዋንዳ", "ታንዛኒያ", "ጅቡቲ"],
        correctAnswer: "ጅቡቲ",
        explanation:
          "ጅቡቲ ከኢትዮጵያ ጋር የምትዋሰን የጎረቤት ሀገር ናት።",
      },
      {
        id: "g6science-3",
        order: 3,
        question:
          "በኢትዬጵያ የጥያ ትክል ዲንጋይ ትክክለኛ ፍፁማዊ መገኛ የትኛው ነው?",
        options: [
          "8°25’58\" N, 38°36’35\" E",
          "9°25’58\" N, 38°36’35\" E",
          "8°25’58\" N, 39°36’35\" E",
          "7°25’58\" N, 38°36’35\" E",
        ],
        correctAnswer: "8°25’58\" N, 38°36’35\" E",
        explanation:
          "ፍፁማዊ መገኛ ቦታን በኬክሮስና ኬንትሮስ መጋጠሚያ የሚገልጽ ነው።",
      },
    ],
  },

  {
    id: "grade8-mathematics",
    grade: "Grade 8",
    subject: "Mathematics",
    title: "Grade 8 Mathematics Exam Practice",
    price: 60,
    description:
      "Practice Grade 8 Mathematics questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade8-english",
    grade: "Grade 8",
    subject: "English",
    title: "Grade 8 English Exam Practice",
    price: 60,
    description:
      "Practice Grade 8 English questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade8-science",
    grade: "Grade 8",
    subject: "General Science",
    title: "Grade 8 General Science Exam Practice",
    price: 60,
    description:
      "Practice Grade 8 General Science questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-mathematics",
    grade: "Grade 12",
    subject: "Mathematics",
    title: "Grade 12 Mathematics Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Mathematics questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-english",
    grade: "Grade 12",
    subject: "English",
    title: "Grade 12 English Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 English questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-physics",
    grade: "Grade 12",
    subject: "Physics",
    title: "Grade 12 Physics Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Physics questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-chemistry",
    grade: "Grade 12",
    subject: "Chemistry",
    title: "Grade 12 Chemistry Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Chemistry questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-biology",
    grade: "Grade 12",
    subject: "Biology",
    title: "Grade 12 Biology Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Biology questions with answers and explanations.",
    active: true,
    questions: [],
  },
];

export const EXAM_GRADES = [
  "Grade 6",
  "Grade 8",
  "Grade 12",
];

export function getProductsByGrade(grade) {
  return examProducts.filter(
    (product) => product.grade === grade && product.active
  );
}

export function getProductById(id) {
  return examProducts.find(
    (product) => product.id === id && product.active
  );
}