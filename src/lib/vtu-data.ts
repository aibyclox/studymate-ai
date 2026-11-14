export interface VTUCollege {
  code: string;
  name: string;
  region: "Bengaluru" | "Mysuru" | "Belagavi" | "Kalaburagi";
  district: string;
}

export interface VTUSubject {
  code: string;
  name: string;
  credits: number;
  type: "Core" | "Elective" | "Lab" | "Mandatory";
  color?: string;
  units?: { unit_number: number; title: string; description: string }[];
}

// 1. Comprehensive list of VTU Affiliated & Constituent Colleges
export const VTU_COLLEGES: VTUCollege[] = [
  // Bengaluru Region
  { code: "1RV", name: "R.V. College of Engineering (RVCE), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1BM", name: "B.M.S. College of Engineering (BMSCE), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1MS", name: "Ramaiah Institute of Technology (MSRIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1DS", name: "Dayananda Sagar College of Engineering (DSCE), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1BI", name: "Bangalore Institute of Technology (BIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1BY", name: "B.M.S. Institute of Technology and Management (BMSIT&M), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1MV", name: "Sir M. Visvesvaraya Institute of Technology (Sir MVIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1RN", name: "R.N.S. Institute of Technology (RNSIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1NH", name: "New Horizon College of Engineering (NHCE), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1CR", name: "CMR Institute of Technology (CMRIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1GA", name: "Global Academy of Technology (GAT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1OX", name: "The Oxford College of Engineering, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1CD", name: "Cambridge Institute of Technology, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1SJ", name: "SJB Institute of Technology (SJBIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1JS", name: "JSS Academy of Technical Education (JSSATE), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1DB", name: "Don Bosco Institute of Technology (DBIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1AY", name: "Acharya Institute of Technology (AIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1BN", name: "B.N.M. Institute of Technology (BNMIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1MJ", name: "MVJ College of Engineering, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1KS", name: "K.S. Institute of Technology (KSIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1HK", name: "H.K.B.K. College of Engineering, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1EW", name: "East West Institute of Technology, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1DT", name: "Dayananda Sagar Academy of Technology & Management (DSATM), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1NT", name: "Nitte Meenakshi Institute of Technology (NMIT), Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1AM", name: "AMC Engineering College, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1VI", name: "Vemana Institute of Technology, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1AT", name: "Atria Institute of Technology, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1RR", name: "R.R. Institute of Technology, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },
  { code: "1SP", name: "Sapthagiri College of Engineering, Bengaluru", region: "Bengaluru", district: "Bengaluru Urban" },

  // Mysuru & Southern Region
  { code: "4NI", name: "The National Institute of Engineering (NIE), Mysuru", region: "Mysuru", district: "Mysuru" },
  { code: "4JC", name: "Sri Jayachamarajendra College of Engineering (SJCE), Mysuru", region: "Mysuru", district: "Mysuru" },
  { code: "1SI", name: "Siddaganga Institute of Technology (SIT), Tumakuru", region: "Mysuru", district: "Tumakuru" },
  { code: "4MC", name: "Malnad College of Engineering (MCE), Hassan", region: "Mysuru", district: "Hassan" },
  { code: "4VV", name: "Vidya Vikas Institute of Engineering and Technology (VVIET), Mysuru", region: "Mysuru", district: "Mysuru" },
  { code: "4AI", name: "Adichunchanagiri Institute of Technology (AIT), Chikkamagaluru", region: "Mysuru", district: "Chikkamagaluru" },
  { code: "4JN", name: "Jawaharlal Nehru National College of Engineering (JNNCE), Shivamogga", region: "Mysuru", district: "Shivamogga" },
  { code: "4VP", name: "PES Institute of Technology and Management (PESITM), Shivamogga", region: "Mysuru", district: "Shivamogga" },
  { code: "4CI", name: "Channabasaveshwara Institute of Technology (CIT), Gubbi", region: "Mysuru", district: "Tumakuru" },
  { code: "4GH", name: "Government Engineering College (GEC), Hassan", region: "Mysuru", district: "Hassan" },
  { code: "4GM", name: "GM Institute of Technology (GMIT), Davanagere", region: "Mysuru", district: "Davanagere" },
  { code: "4BI", name: "Bapuji Institute of Engineering and Technology (BIET), Davanagere", region: "Mysuru", district: "Davanagere" },

  // Coastal & Mangaluru (Affiliated under Mysuru/VTU)
  { code: "4SF", name: "Sahyadri College of Engineering and Management, Mangaluru", region: "Mysuru", district: "Dakshina Kannada" },
  { code: "4SO", name: "St. Joseph Engineering College (SJEC), Mangaluru", region: "Mysuru", district: "Dakshina Kannada" },
  { code: "4NM", name: "NMAM Institute of Technology, Nitte", region: "Mysuru", district: "Udupi" },
  { code: "4MW", name: "Shri Madhwa Vadiraja Institute of Technology & Management, Bantakal", region: "Mysuru", district: "Udupi" },
  { code: "4PA", name: "P.A. College of Engineering (PACE), Mangaluru", region: "Mysuru", district: "Dakshina Kannada" },
  { code: "4AL", name: "Alva's Institute of Engineering & Technology, Moodbidri", region: "Mysuru", district: "Dakshina Kannada" },
  { code: "4CA", name: "Canara Engineering College, Benjanapadavu", region: "Mysuru", district: "Dakshina Kannada" },

  // Belagavi Region
  { code: "2GI", name: "KLS Gogte Institute of Technology (GIT), Belagavi", region: "Belagavi", district: "Belagavi" },
  { code: "2KL", name: "KLE Dr. M. S. Sheshgiri College of Engineering & Technology, Belagavi", region: "Belagavi", district: "Belagavi" },
  { code: "2TG", name: "KLE Institute of Technology, Hubballi", region: "Belagavi", district: "Dharwad" },
  { code: "2BA", name: "Basaveshwar Engineering College (BEC), Bagalkot", region: "Belagavi", district: "Bagalkot" },
  { code: "2BL", name: "BLDEA's V.P. Dr. P.G. Halakatti College of Engineering, Vijayapura", region: "Belagavi", district: "Vijayapura" },
  { code: "2AG", name: "Angadi Institute of Technology and Management (AITM), Belagavi", region: "Belagavi", district: "Belagavi" },
  { code: "2SD", name: "SDM College of Engineering and Technology (SDMCET), Dharwad", region: "Belagavi", district: "Dharwad" },
  { code: "2BV", name: "B.V. Bhoomaraddi College of Engineering & Technology (KLE Tech), Hubballi", region: "Belagavi", district: "Dharwad" },
  { code: "2MM", name: "Maratha Mandal Engineering College, Belagavi", region: "Belagavi", district: "Belagavi" },
  { code: "2SR", name: "S.G. Balekundri Institute of Technology, Belagavi", region: "Belagavi", district: "Belagavi" },
  { code: "2KA", name: "Karnataka Law Society's Vishwanathrao Deshpande Institute of Technology, Haliyal", region: "Belagavi", district: "Uttara Kannada" },
  { code: "2ST", name: "Secab Institute of Engineering and Technology, Vijayapura", region: "Belagavi", district: "Vijayapura" },

  // Kalaburagi Region
  { code: "3PG", name: "PDA College of Engineering, Kalaburagi", region: "Kalaburagi", district: "Kalaburagi" },
  { code: "3GN", name: "Guru Nanak Dev Engineering College (GNDEC), Bidar", region: "Kalaburagi", district: "Bidar" },
  { code: "3BK", name: "Bheemanna Khandre Institute of Technology (BKIT), Bhalki", region: "Kalaburagi", district: "Bidar" },
  { code: "3AE", name: "Appa Institute of Engineering and Technology, Kalaburagi", region: "Kalaburagi", district: "Kalaburagi" },
  { code: "3NA", name: "Navodaya Institute of Technology, Raichur", region: "Kalaburagi", district: "Raichur" },
  { code: "3VC", name: "Rao Bahadur Y. Mahabaleswarappa Engineering College (RYMEC), Ballari", region: "Kalaburagi", district: "Ballari" },
  { code: "3BR", name: "Ballari Institute of Technology and Management (BITM), Ballari", region: "Kalaburagi", district: "Ballari" },
  { code: "3GK", name: "Government Engineering College, Raichur", region: "Kalaburagi", district: "Raichur" },
];

// 2. Comprehensive VTU Engineering Departments
export const VTU_DEPARTMENTS = [
  { id: "CSE", name: "Computer Science & Engineering (CSE)" },
  { id: "ISE", name: "Information Science & Engineering (ISE)" },
  { id: "AIML", name: "Artificial Intelligence & Machine Learning (AI & ML)" },
  { id: "AIDS", name: "Artificial Intelligence & Data Science (AI & DS)" },
  { id: "CSBS", name: "Computer Science & Business Systems (CSBS)" },
  { id: "CSD", name: "Computer Science & Design (CSD)" },
  { id: "ECE", name: "Electronics & Communication Engineering (ECE)" },
  { id: "EEE", name: "Electrical & Electronics Engineering (EEE)" },
  { id: "ME", name: "Mechanical Engineering (ME)" },
  { id: "CV", name: "Civil Engineering (CV)" },
  { id: "AE", name: "Aeronautical Engineering (AE)" },
  { id: "BT", name: "Biotechnology (BT)" },
  { id: "RA", name: "Robotics & Automation (RA)" },
  { id: "MT", name: "Mechatronics Engineering" },
  { id: "CH", name: "Chemical Engineering" },
  { id: "AU", name: "Automobile Engineering" },
  { id: "IEM", name: "Industrial Engineering & Management (IEM)" },
];

// 3. VTU Syllabus Subjects Catalog (2022 / 2021 Scheme)
export const VTU_SYLLABUS: Record<string, Record<number, VTUSubject[]>> = {
  // Computer Science & Engineering (CSE) and allied branches
  CSE: {
    1: [
      { code: "BMATS101", name: "Mathematics-I for CSE Stream", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BPHYS102", name: "Applied Physics for CSE Stream", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BPOPS103", name: "Principles of Programming using C", credits: 3, type: "Core", color: "#059669" },
      { code: "BESCK104", name: "Basic Electronics & Communication", credits: 3, type: "Core", color: "#d97706" },
      { code: "BENGK106", name: "Communicative English", credits: 1, type: "Mandatory", color: "#475569" },
      { code: "BIDTK158", name: "Innovation and Design Thinking", credits: 1, type: "Mandatory", color: "#7c3aed" },
    ],
    2: [
      { code: "BMATS201", name: "Mathematics-II for CSE Stream", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BCHEM202", name: "Applied Chemistry for CSE Stream", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BCEDK203", name: "Computer-Aided Engineering Drawing", credits: 3, type: "Core", color: "#d97706" },
      { code: "BPLCK205", name: "Python Programming Laboratory", credits: 3, type: "Core", color: "#059669" },
      { code: "BKSK207", name: "Samskrutika / Balake Kannada", credits: 1, type: "Mandatory", color: "#475569" },
      { code: "BSFHK258", name: "Scientific Foundations of Health", credits: 1, type: "Mandatory", color: "#e11d48" },
    ],
    3: [
      {
        code: "BCS301",
        name: "Mathematics for Computer Science",
        credits: 4,
        type: "Core",
        color: "#4f46e5",
        units: [
          { unit_number: 1, title: "Vector Spaces & Linear Algebra", description: "Vector spaces, subspaces, linear independence, basis and dimension." },
          { unit_number: 2, title: "Orthogonality & SVD", description: "Inner product spaces, Gram-Schmidt orthogonalization, singular value decomposition." },
          { unit_number: 3, title: "Probability Distributions", description: "Random variables, binomial, Poisson, normal distributions, joint distributions." },
          { unit_number: 4, title: "Markov Chains & Graph Theory", description: "Transition probability matrices, Markov processes, graph models in computing." },
          { unit_number: 5, title: "Statistical Inference", description: "Sampling theory, hypothesis testing, Chi-square and t-tests." },
        ],
      },
      {
        code: "BCS302",
        name: "Digital Design & Computer Organization",
        credits: 4,
        type: "Core",
        color: "#0284c7",
        units: [
          { unit_number: 1, title: "Combinational Logic Design", description: "Boolean algebra, K-maps, multiplexers, decoders, arithmetic circuits." },
          { unit_number: 2, title: "Sequential Logic Circuits", description: "Flip-flops, registers, counters, finite state machines (FSM)." },
          { unit_number: 3, title: "Basic Computer Organization", description: "Instruction codes, registers, computer instructions, timing and control." },
          { unit_number: 4, title: "Central Processing Unit", description: "General register organization, stack organization, instruction formats, addressing modes." },
          { unit_number: 5, title: "Memory & Input-Output", description: "Memory hierarchy, main memory, auxiliary, cache memory, DMA." },
        ],
      },
      {
        code: "BCS303",
        name: "Operating Systems",
        credits: 4,
        type: "Core",
        color: "#059669",
        units: [
          { unit_number: 1, title: "Introduction & OS Structures", description: "OS services, system calls, system programs, virtual machines." },
          { unit_number: 2, title: "Process Management & CPU Scheduling", description: "Processes, threads, IPC, scheduling algorithms, multi-core scheduling." },
          { unit_number: 3, title: "Synchronization & Deadlocks", description: "Critical section, semaphores, monitors, deadlock prevention, detection, and recovery." },
          { unit_number: 4, title: "Memory Management", description: "Swapping, paging, segmentation, virtual memory, demand paging, page replacement." },
          { unit_number: 5, title: "File Systems & Storage", description: "File concept, access methods, directory structure, disk scheduling algorithms." },
        ],
      },
      {
        code: "BCS304",
        name: "Data Structures and Applications",
        credits: 3,
        type: "Core",
        color: "#7c3aed",
        units: [
          { unit_number: 1, title: "Introduction & Arrays/Strings", description: "Pointers, dynamic memory allocation, arrays, string representation and pattern matching." },
          { unit_number: 2, title: "Stacks & Queues", description: "Stack operations, infix to postfix, recursion, circular queues, deques." },
          { unit_number: 3, title: "Linked Lists", description: "Singly, doubly, circular linked lists, polynomial representation and addition." },
          { unit_number: 4, title: "Trees & Binary Search Trees", description: "Binary trees, traversals, BST operations, threaded binary trees, AVL trees." },
          { unit_number: 5, title: "Graphs & Hashing", description: "Graph representations, BFS, DFS, hash tables, hash functions, collision resolution." },
        ],
      },
      {
        code: "BCS306A",
        name: "Object-Oriented Programming with Java",
        credits: 3,
        type: "Core",
        color: "#d97706",
      },
    ],
    4: [
      {
        code: "BCS401",
        name: "Analysis & Design of Algorithms",
        credits: 4,
        type: "Core",
        color: "#4f46e5",
        units: [
          { unit_number: 1, title: "Introduction & Asymptotic Notations", description: "Notions of algorithm, space and time complexity, Big-O, Omega, Theta notations." },
          { unit_number: 2, title: "Divide and Conquer", description: "Merge sort, quick sort, binary search, matrix multiplication." },
          { unit_number: 3, title: "Greedy Technique", description: "Knapsack problem, Prim's algorithm, Kruskal's algorithm, Dijkstra's algorithm, Huffman trees." },
          { unit_number: 4, title: "Dynamic Programming", description: "Warshall's & Floyd's algorithms, 0/1 Knapsack, Bellman-Ford algorithm." },
          { unit_number: 5, title: "Backtracking & Branch-and-Bound", description: "N-Queens problem, Hamiltonian circuit, subset sum, NP-Completeness." },
        ],
      },
      {
        code: "BCS402",
        name: "Microcontrollers & Embedded Systems",
        credits: 4,
        type: "Core",
        color: "#0284c7",
      },
      {
        code: "BCS403",
        name: "Database Management Systems",
        credits: 4,
        type: "Core",
        color: "#7c3aed",
        units: [
          { unit_number: 1, title: "Introduction & Database Architecture", description: "Three-schema architecture, data independence, DBMS languages, ER diagrams." },
          { unit_number: 2, title: "Relational Model & Constraints", description: "Relational model concepts, relational integrity constraints, relational algebra operations." },
          { unit_number: 3, title: "SQL & Relational Calculus", description: "SQL DDL, DML, complex queries, nested subqueries, views, assertions." },
          { unit_number: 4, title: "Database Design & Normalization", description: "Functional dependencies, 1NF, 2NF, 3NF, BCNF, 4NF, lossless decomposition." },
          { unit_number: 5, title: "Transaction Processing & Concurrency", description: "ACID properties, serializability, lock-based protocols, two-phase locking (2PL)." },
        ],
      },
      {
        code: "BCS405A",
        name: "Discrete Mathematical Structures",
        credits: 3,
        type: "Core",
        color: "#059669",
      },
      {
        code: "BBOC407",
        name: "Biology for Computer Engineers",
        credits: 2,
        type: "Mandatory",
        color: "#e11d48",
      },
    ],
    5: [
      {
        code: "BCS501",
        name: "Software Engineering & Project Management",
        credits: 3,
        type: "Core",
        color: "#4f46e5",
        units: [
          { unit_number: 1, title: "Software Process Models", description: "Waterfall model, incremental development, agile software engineering, Scrum." },
          { unit_number: 2, title: "Requirements Engineering", description: "Functional and non-functional requirements, requirement specification, validation." },
          { unit_number: 3, title: "System Modeling & Architectural Design", description: "Context models, interaction models, architectural patterns, object-oriented design." },
          { unit_number: 4, title: "Testing & Evolution", description: "Unit testing, integration testing, system testing, software maintenance and refactoring." },
          { unit_number: 5, title: "Project Management & Estimation", description: "COCOMO model, risk management, project scheduling, quality assurance." },
        ],
      },
      {
        code: "BCS502",
        name: "Computer Networks",
        credits: 4,
        type: "Core",
        color: "#0284c7",
        units: [
          { unit_number: 1, title: "Application Layer Protocols", description: "Principles of network applications, HTTP, FTP, SMTP, DNS, socket programming." },
          { unit_number: 2, title: "Transport Layer", description: "Multiplexing/demultiplexing, UDP, TCP connection management, reliable data transfer, congestion control." },
          { unit_number: 3, title: "Network Layer: Data Plane", description: "Router architecture, IPv4 addressing, subnetting, CIDR, NAT, IPv6." },
          { unit_number: 4, title: "Network Layer: Control Plane", description: "Routing algorithms, Link-state (OSPF), Distance vector (RIP), BGP, SDN concepts." },
          { unit_number: 5, title: "Link Layer & Wireless Networks", description: "Error detection (CRC), multiple access protocols (CSMA/CD), Ethernet, switches, wireless LANs (802.11)." },
        ],
      },
      {
        code: "BCS503",
        name: "Theory of Computation",
        credits: 4,
        type: "Core",
        color: "#7c3aed",
        units: [
          { unit_number: 1, title: "Regular Languages & Finite Automata", description: "Deterministic Finite Automata (DFA), Non-deterministic Finite Automata (NFA), Regular expressions." },
          { unit_number: 2, title: "Properties of Regular Languages", description: "Pumping Lemma for regular languages, closure properties, minimization of DFA." },
          { unit_number: 3, title: "Context-Free Grammars & Languages", description: "CFG, derivations, parse trees, ambiguity, Chomsky Normal Form (CNF), Pushdown Automata (PDA)." },
          { unit_number: 4, title: "Properties of CFLs & Turing Machines", description: "Pumping lemma for CFLs, Turing Machine model, programming techniques for TM." },
          { unit_number: 5, title: "Undecidability & Complexity", description: "Halting problem, Post Correspondence Problem (PCP), Decidability, P and NP classes." },
        ],
      },
      {
        code: "BCSL504",
        name: "Web Technology Laboratory",
        credits: 2,
        type: "Lab",
        color: "#059669",
      },
      {
        code: "BCS515A",
        name: "Artificial Intelligence",
        credits: 3,
        type: "Elective",
        color: "#d97706",
      },
      {
        code: "BRMK557",
        name: "Research Methodology and IPR",
        credits: 3,
        type: "Mandatory",
        color: "#475569",
      },
      {
        code: "BCS508",
        name: "Environmental Studies & E-Waste",
        credits: 1,
        type: "Mandatory",
        color: "#e11d48",
      },
    ],
    6: [
      {
        code: "BCS601",
        name: "Cloud Computing",
        credits: 4,
        type: "Core",
        color: "#4f46e5",
        units: [
          { unit_number: 1, title: "Introduction & Cloud Architecture", description: "Cloud computing characteristics, SPI model (SaaS, PaaS, IaaS), deployment models." },
          { unit_number: 2, title: "Virtualization Technology", description: "Server virtualization, hypervisors, storage virtualization, network virtualization." },
          { unit_number: 3, title: "Cloud Storage & Data Management", description: "Distributed file systems (GFS, HDFS), BigTable, NoSQL databases in cloud." },
          { unit_number: 4, title: "Cloud Security & Privacy", description: "Identity and access management (IAM), data security, encryption, multi-tenancy." },
          { unit_number: 5, title: "Cloud Services & Serverless", description: "AWS, Azure, GCP core services, containerization with Docker & Kubernetes, serverless." },
        ],
      },
      {
        code: "BCS602",
        name: "Machine Learning",
        credits: 4,
        type: "Core",
        color: "#7c3aed",
        units: [
          { unit_number: 1, title: "Foundations & Linear Models", description: "Supervised vs unsupervised, Linear Regression, Logistic Regression, Cost functions, Gradient Descent." },
          { unit_number: 2, title: "Decision Trees & Ensemble Methods", description: "Entropy, Information Gain, CART, Random Forests, Bagging, Boosting (AdaBoost, XGBoost)." },
          { unit_number: 3, title: "Support Vector Machines & Kernel Methods", description: "Linear SVM, soft-margin, kernel trick (RBF, Polynomial), margin maximization." },
          { unit_number: 4, title: "Unsupervised Learning & Clustering", description: "K-Means clustering, Hierarchical clustering, PCA, Dimensionality reduction." },
          { unit_number: 5, title: "Neural Networks & Evaluation", description: "Perceptron, Multi-Layer Perceptron (MLP), Backpropagation, Precision, Recall, ROC-AUC, cross-validation." },
        ],
      },
      {
        code: "BCS613",
        name: "Cryptography & Network Security",
        credits: 3,
        type: "Elective",
        color: "#0284c7",
      },
      {
        code: "BCS614",
        name: "Full Stack Development",
        credits: 3,
        type: "Elective",
        color: "#059669",
      },
      {
        code: "BCSL605",
        name: "Machine Learning Laboratory",
        credits: 2,
        type: "Lab",
        color: "#d97706",
      },
    ],
    7: [
      { code: "BCS701", name: "Deep Learning", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BCS702", name: "Big Data Analytics", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BCS703", name: "Internet of Things (IoT)", credits: 3, type: "Elective", color: "#059669" },
      { code: "BCSP704", name: "Project Work Phase-1", credits: 3, type: "Core", color: "#4f46e5" },
    ],
    8: [
      { code: "BCSP801", name: "Major Project Work Phase-2", credits: 10, type: "Core", color: "#4f46e5" },
      { code: "BCSS802", name: "Technical Seminar & Internship", credits: 4, type: "Core", color: "#059669" },
    ],
  },

  // Electronics & Communication Engineering (ECE)
  ECE: {
    3: [
      { code: "BMATE301", name: "Mathematics for ECE Stream-I", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BEC302", name: "Digital System Design using Verilog", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BEC303", name: "Network Analysis & Transmission Lines", credits: 4, type: "Core", color: "#059669" },
      { code: "BEC304", name: "Electronic Devices & Circuit Theory", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BEC306A", name: "C++ Programming for Embedded Systems", credits: 3, type: "Core", color: "#d97706" },
    ],
    4: [
      { code: "BMATE401", name: "Complex Analysis, Probability & Stats", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BEC402", name: "Analog Circuits", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BEC403", name: "Signals and Systems", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BEC404", name: "Communication Theory", credits: 4, type: "Core", color: "#059669" },
      { code: "BEC405", name: "Microcontrollers (ARM Cortex)", credits: 3, type: "Core", color: "#d97706" },
    ],
    5: [
      { code: "BEC501", name: "Digital Signal Processing (DSP)", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BEC502", name: "Electromagnetic Waves & Antennas", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BEC503", name: "VLSI Design", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BEC514", name: "Control Systems", credits: 3, type: "Elective", color: "#059669" },
    ],
    6: [
      { code: "BEC601", name: "Computer Communication Networks", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BEC602", name: "Embedded System Design", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BEC603", name: "Microwave Engineering", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BEC614", name: "Optical Fiber Communication", credits: 3, type: "Elective", color: "#059669" },
    ],
  },

  // Mechanical Engineering (ME)
  ME: {
    3: [
      { code: "BMATM301", name: "Mathematics for Mechanical Stream-I", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BME302", name: "Mechanics of Materials", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BME303", name: "Material Science and Metallurgy", credits: 3, type: "Core", color: "#059669" },
      { code: "BME304", name: "Basic Thermodynamics", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BME305", name: "Manufacturing Processes", credits: 3, type: "Core", color: "#d97706" },
    ],
    4: [
      { code: "BMATM401", name: "Mathematics for Mechanical Stream-II", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BME402", name: "Applied Thermodynamics", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BME403", name: "Fluid Mechanics & Machinery", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BME404", name: "Kinematics of Machines", credits: 4, type: "Core", color: "#059669" },
      { code: "BME405", name: "Machining & Machine Tools", credits: 3, type: "Core", color: "#d97706" },
    ],
    5: [
      { code: "BME501", name: "Design of Machine Elements - I", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BME502", name: "Turbo Machines", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BME503", name: "Heat Transfer", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BME504", name: "Dynamics of Machinery", credits: 4, type: "Core", color: "#059669" },
    ],
    6: [
      { code: "BME601", name: "Design of Machine Elements - II", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BME602", name: "Finite Element Method (FEM)", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BME603", name: "Mechatronics & Microprocessors", credits: 3, type: "Core", color: "#7c3aed" },
      { code: "BME614", name: "Operations Research", credits: 3, type: "Elective", color: "#059669" },
    ],
  },

  // Civil Engineering (CV)
  CV: {
    3: [
      { code: "BMATC301", name: "Mathematics for Civil Stream-I", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BCV302", name: "Strength of Materials", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BCV303", name: "Fluid Mechanics", credits: 4, type: "Core", color: "#059669" },
      { code: "BCV304", name: "Basic Surveying", credits: 3, type: "Core", color: "#7c3aed" },
      { code: "BCV305", name: "Building Materials and Construction", credits: 3, type: "Core", color: "#d97706" },
    ],
    4: [
      { code: "BMATC401", name: "Mathematics for Civil Stream-II", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BCV402", name: "Analysis of Determinate Structures", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BCV403", name: "Applied Hydraulics", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BCV404", name: "Concrete Technology", credits: 3, type: "Core", color: "#059669" },
      { code: "BCV405", name: "Advanced Surveying & Geomatics", credits: 3, type: "Core", color: "#d97706" },
    ],
    5: [
      { code: "BCV501", name: "Design of RC Structural Elements", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BCV502", name: "Analysis of Indeterminate Structures", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BCV503", name: "Geotechnical Engineering - I", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BCV504", name: "Hydrology and Water Resources", credits: 3, type: "Core", color: "#059669" },
    ],
    6: [
      { code: "BCV601", name: "Design of Steel Structural Elements", credits: 4, type: "Core", color: "#4f46e5" },
      { code: "BCV602", name: "Highway Engineering & Traffic Studies", credits: 4, type: "Core", color: "#0284c7" },
      { code: "BCV603", name: "Environmental Engineering - I", credits: 4, type: "Core", color: "#7c3aed" },
      { code: "BCV614", name: "Geotechnical Engineering - II", credits: 3, type: "Elective", color: "#059669" },
    ],
  },
};

// Aliases for computer-allied branches
VTU_SYLLABUS["ISE"] = VTU_SYLLABUS["CSE"];
VTU_SYLLABUS["AIML"] = VTU_SYLLABUS["CSE"];
VTU_SYLLABUS["AIDS"] = VTU_SYLLABUS["CSE"];
VTU_SYLLABUS["CSBS"] = VTU_SYLLABUS["CSE"];
VTU_SYLLABUS["CSD"] = VTU_SYLLABUS["CSE"];

export function getVTUSubjects(branch: string, semester: number): VTUSubject[] {
  const normBranch = branch.toUpperCase();
  const branchData =
    VTU_SYLLABUS[normBranch] ||
    (normBranch.includes("COMP") || normBranch.includes("CSE") || normBranch.includes("INFO")
      ? VTU_SYLLABUS["CSE"]
      : normBranch.includes("ELEC") || normBranch.includes("COMM") || normBranch.includes("ECE")
      ? VTU_SYLLABUS["ECE"]
      : normBranch.includes("MECH")
      ? VTU_SYLLABUS["ME"]
      : normBranch.includes("CIVIL")
      ? VTU_SYLLABUS["CV"]
      : VTU_SYLLABUS["CSE"]);

  return branchData[semester] || branchData[5] || branchData[3] || [];
}

