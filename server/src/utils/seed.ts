import { Quiz } from '../models/Quiz.js';

const difficultyQuestionCounts = {
  Easy: 3,
  Medium: 10,
  Hard: 15,
} as const;

const limitQuestions = (
  questions: Array<{ id: string; question: string; options: string[]; correctAnswer: string; explanation: string }>,
  difficulty: keyof typeof difficultyQuestionCounts
) => {
  const targetCount = difficultyQuestionCounts[difficulty];
  const expanded: Array<{ id: string; question: string; options: string[]; correctAnswer: string; explanation: string }> = [];

  let cycleIndex = 0;
  while (expanded.length < targetCount) {
    for (const question of questions) {
      if (expanded.length >= targetCount) break;
      expanded.push({
        ...question,
        id: `${difficulty.toLowerCase()}-${cycleIndex}-${question.id}`,
      });
    }
    cycleIndex += 1;
  }

  return expanded.slice(0, targetCount);
};

export const seedQuizzes = async (): Promise<void> => {
  const existingQuizzes = await Quiz.find({}, { title: 1 }).lean();
  const existingTitles = new Set(existingQuizzes.map((quiz) => quiz.title));

  const sampleQuizzes = [
    {
      title: 'React Essentials',
      description: 'Test your knowledge of components, state, hooks, and rendering patterns.',
      category: 'Technology',
      difficulty: 'Easy',
      durationMinutes: 12,
      questions: limitQuestions([
        { id: 'q1', question: 'Which hook is used to manage local state in a function component?', options: ['useEffect', 'useState', 'useMemo', 'useRef'], correctAnswer: 'useState', explanation: 'useState is the built-in hook for local component state in React.' },
        { id: 'q2', question: 'What is JSX?', options: ['A JavaScript runtime', 'A syntax extension for JavaScript that looks like HTML', 'A CSS framework', 'A state management library'], correctAnswer: 'A syntax extension for JavaScript that looks like HTML', explanation: 'JSX lets developers write UI markup in a syntax similar to HTML inside JavaScript code.' },
        { id: 'q3', question: 'Which method is commonly used to render a list of elements in React?', options: ['map()', 'forEach()', 'loop()', 'reduce()'], correctAnswer: 'map()', explanation: 'The map method is used to transform arrays into React elements.' },
        { id: 'q4', question: 'Which prop is used to pass data from a parent component to a child component?', options: ['state', 'props', 'context', 'ref'], correctAnswer: 'props', explanation: 'Props allow parent components to pass data into children.' },
        { id: 'q5', question: 'What is the purpose of useEffect in React?', options: ['To create JSX markup', 'To perform side effects after rendering', 'To style components', 'To replace state entirely'], correctAnswer: 'To perform side effects after rendering', explanation: 'useEffect is used for side effects such as data fetching and subscriptions.' }
      ], 'Easy')
    },
    {
      title: 'Cybersecurity Fundamentals',
      description: 'Assess your understanding of secure systems and common threats.',
      category: 'Cybersecurity',
      difficulty: 'Medium',
      durationMinutes: 15,
      questions: limitQuestions([
        { id: 'q1', question: 'What does HTTPS provide that HTTP does not?', options: ['Faster page loading', 'Encrypted communication', 'Larger file transfers', 'CORS support'], correctAnswer: 'Encrypted communication', explanation: 'HTTPS encrypts the communication between the client and the server using TLS.' },
        { id: 'q2', question: 'Which practice is most effective against password guessing attacks?', options: ['Using only uppercase letters', 'Multi-factor authentication', 'Disabling all login alerts', 'Shorter passwords'], correctAnswer: 'Multi-factor authentication', explanation: 'MFA adds a second proof of identity, reducing the risk of credential-based compromise.' },
        { id: 'q3', question: 'What is a phishing attack?', options: ['A network outage', 'An attempt to trick users into revealing sensitive information', 'A database backup process', 'A file compression tool'], correctAnswer: 'An attempt to trick users into revealing sensitive information', explanation: 'Phishing relies on deception to fool people into sharing passwords or personal data.' },
        { id: 'q4', question: 'What is the purpose of a firewall?', options: ['To prevent malware downloads only', 'To filter and monitor network traffic', 'To encrypt files in storage', 'To manage DNS records'], correctAnswer: 'To filter and monitor network traffic', explanation: 'A firewall inspects and regulates incoming and outgoing network traffic.' },
        { id: 'q5', question: 'Which security principle ensures that only authorized users can access resources?', options: ['Confidentiality', 'Integrity', 'Availability', 'Scalability'], correctAnswer: 'Confidentiality', explanation: 'Confidentiality restricts access to authorized users and protects data from exposure.' }
      ], 'Medium')
    },
    {
      title: 'Network Security Essentials',
      description: 'Understand core network protection strategies and common attack vectors.',
      category: 'Network Security',
      difficulty: 'Medium',
      durationMinutes: 18,
      questions: limitQuestions([
        { id: 'q1', question: 'Which protocol is commonly used to secure remote administration access?', options: ['FTP', 'SSH', 'SMTP', 'HTTP'], correctAnswer: 'SSH', explanation: 'SSH provides encrypted remote access for command-line administration and file transfers.' },
        { id: 'q2', question: 'What is a DoS attack?', options: ['A method to add system users', 'An attempt to overwhelm a service and make it unavailable', 'A database optimization process', 'A code review technique'], correctAnswer: 'An attempt to overwhelm a service and make it unavailable', explanation: 'A Denial of Service attack floods a service with excessive requests, degrading or blocking access.' },
        { id: 'q3', question: 'What does IDS stand for?', options: ['Internet Defense Service', 'Intrusion Detection System', 'Integrated Device Server', 'Internal Data Security'], correctAnswer: 'Intrusion Detection System', explanation: 'An IDS monitors traffic and alerts administrators to suspicious activity.' },
        { id: 'q4', question: 'Which tool is often used to analyze traffic patterns and inspect packets?', options: ['Wireshark', 'Photoshop', 'Git', 'Docker'], correctAnswer: 'Wireshark', explanation: 'Wireshark is a packet analyzer commonly used for network troubleshooting and security analysis.' },
        { id: 'q5', question: 'Why is segmentation useful in a network?', options: ['It increases browser speed', 'It limits the impact of compromise by isolating systems', 'It reduces code bugs', 'It replaces backups'], correctAnswer: 'It limits the impact of compromise by isolating systems', explanation: 'Network segmentation can contain breaches and reduce lateral movement across the environment.' }
      ], 'Medium')
    },
    {
      title: 'Ethical Hacking Foundations',
      description: 'Practice the fundamentals of responsible security testing and discovery.',
      category: 'Ethical Hacking',
      difficulty: 'Hard',
      durationMinutes: 20,
      questions: limitQuestions([
        { id: 'q1', question: 'What is the main goal of ethical hacking?', options: ['To steal data', 'To improve system security with permission', 'To block all traffic', 'To delete logs'], correctAnswer: 'To improve system security with permission', explanation: 'Ethical hacking aims to identify vulnerabilities and help organizations fix them before attackers exploit them.' },
        { id: 'q2', question: 'Which phase of penetration testing usually involves gathering information about the target?', options: ['Exploitation', 'Reconnaissance', 'Cleanup', 'Reporting'], correctAnswer: 'Reconnaissance', explanation: 'Reconnaissance focuses on collecting information about the target environment and attack surface.' },
        { id: 'q3', question: 'What is a vulnerability assessment?', options: ['A way to increase server speed', 'A process of identifying weaknesses in systems', 'A backup recovery plan', 'A firewall update'], correctAnswer: 'A process of identifying weaknesses in systems', explanation: 'Vulnerability assessment identifies and prioritizes weaknesses that may require remediation.' },
        { id: 'q4', question: 'Which of these is a legitimate security testing activity?', options: ['Accessing data without permission', 'Testing systems under written authorization', 'Installing ransomware in a lab', 'Sharing passwords publicly'], correctAnswer: 'Testing systems under written authorization', explanation: 'Ethical hacking requires proper permissions and a defined scope.' },
        { id: 'q5', question: 'Why is documentation important during a security assessment?', options: ['So the report can be ignored', 'To record findings, evidence, and remediation steps', 'To hide vulnerabilities', 'To reduce CPU usage'], correctAnswer: 'To record findings, evidence, and remediation steps', explanation: 'Clear documentation supports remediation, accountability, and future audits.' }
      ], 'Hard')
    },
    {
      title: 'Cloud Security Basics',
      description: 'Explore protection strategies for cloud workloads, identities, and data.',
      category: 'Cloud Security',
      difficulty: 'Hard',
      durationMinutes: 22,
      questions: limitQuestions([
        { id: 'q1', question: 'What is the purpose of IAM in cloud systems?', options: ['To provide identity and access control', 'To host application code', 'To optimize file compression', 'To reduce memory usage'], correctAnswer: 'To provide identity and access control', explanation: 'IAM manages users, roles, and permissions to control access to cloud resources.' },
        { id: 'q2', question: 'What is a common security risk if access keys are exposed?', options: ['Faster deployment', 'Unauthorized access to cloud resources', 'Lower latency', 'Fewer errors'], correctAnswer: 'Unauthorized access to cloud resources', explanation: 'Exposed credentials can allow attackers to access cloud services and data.' },
        { id: 'q3', question: 'Which practice improves security for cloud storage?', options: ['Disabling encryption', 'Using encryption and limited access policies', 'Sharing public URLs for everything', 'Leaving data in open buckets'], correctAnswer: 'Using encryption and limited access policies', explanation: 'Encryption and strict access controls help protect sensitive cloud data.' },
        { id: 'q4', question: 'What is the benefit of least privilege access?', options: ['It grants broad rights to all users', 'It reduces exposure by giving only required permissions', 'It removes the need for monitoring', 'It speeds up backups'], correctAnswer: 'It reduces exposure by giving only required permissions', explanation: 'Least privilege minimizes the blast radius of compromised accounts or services.' },
        { id: 'q5', question: 'Which cloud service model gives customers the most control over the operating system?', options: ['SaaS', 'PaaS', 'IaaS', 'DaaS'], correctAnswer: 'IaaS', explanation: 'IaaS provides virtualized infrastructure, so customers manage the OS and software stack more directly.' }
      ], 'Hard')
    },
    {
      title: 'Digital Forensics Overview',
      description: 'Learn how investigators preserve, analyze, and interpret digital evidence.',
      category: 'Digital Forensics',
      difficulty: 'Medium',
      durationMinutes: 16,
      questions: limitQuestions([
        { id: 'q1', question: 'What is the first priority when collecting digital evidence?', options: ['Delete the source files', 'Preserve the evidence in its original state', 'Share the data online', 'Reinstall the operating system'], correctAnswer: 'Preserve the evidence in its original state', explanation: 'A proper chain of custody and evidence preservation is essential in forensics.' },
        { id: 'q2', question: 'Why is hashing useful in forensic investigations?', options: ['It compresses files automatically', 'It verifies whether evidence has been altered', 'It makes files executable', 'It removes metadata'], correctAnswer: 'It verifies whether evidence has been altered', explanation: 'Hash values help investigators confirm that evidence remains unchanged from collection.' },
        { id: 'q3', question: 'What does chain of custody mean?', options: ['The order of software installs', 'The documented history of evidence handling', 'The network firewall rules', 'The encryption key rotation period'], correctAnswer: 'The documented history of evidence handling', explanation: 'Chain of custody documents who handled the evidence and when, preserving trust and integrity.' },
        { id: 'q4', question: 'Which type of data is often examined in forensic analysis?', options: ['Only cloud billing data', 'Logs, files, memory, and artifacts', 'Only spam emails', 'Only user passwords'], correctAnswer: 'Logs, files, memory, and artifacts', explanation: 'Forensic analysis often examines multiple sources of evidence, including logs and memory.' },
        { id: 'q5', question: 'What is the purpose of forensic imaging?', options: ['To create a working copy of the original evidence', 'To remove malicious files', 'To delete all logs', 'To slow down investigations'], correctAnswer: 'To create a working copy of the original evidence', explanation: 'A forensic image is a duplicate used for investigation while preserving the original evidence.' }
      ], 'Medium')
    },
    {
      title: 'JavaScript Logic Sprint',
      description: 'Check your logic and problem-solving with core JavaScript concepts.',
      category: 'Programming',
      difficulty: 'Medium',
      durationMinutes: 18,
      questions: limitQuestions([
        { id: 'q1', question: 'What value does typeof null return in JavaScript?', options: ['null', 'object', 'undefined', 'boolean'], correctAnswer: 'object', explanation: 'This is a long-standing JavaScript quirk caused by the language design.' },
        { id: 'q2', question: 'Which method converts a JSON string into an object?', options: ['JSON.parse()', 'JSON.stringify()', 'Object.keys()', 'Array.from()'], correctAnswer: 'JSON.parse()', explanation: 'JSON.parse() transforms a JSON string into a JavaScript object.' },
        { id: 'q3', question: 'Which array method does not mutate the original array?', options: ['push()', 'splice()', 'sort()', 'filter()'], correctAnswer: 'filter()', explanation: 'filter() returns a new array and leaves the original array unchanged.' },
        { id: 'q4', question: 'What does === compare in JavaScript?', options: ['Only value', 'Only type', 'Value and type', 'Reference only'], correctAnswer: 'Value and type', explanation: 'Strict equality checks both the value and the data type.' },
        { id: 'q5', question: 'Which built-in method executes a function after a delay?', options: ['setTimeout()', 'map()', 'join()', 'reduce()'], correctAnswer: 'setTimeout()', explanation: 'setTimeout() delays callback execution for a specified number of milliseconds.' }
      ], 'Medium')
    },
    {
      title: 'World Geography Pulse',
      description: 'A broad overview of geography, capitals, and global landmarks.',
      category: 'General Knowledge',
      difficulty: 'Easy',
      durationMinutes: 10,
      questions: limitQuestions([
        { id: 'q1', question: 'What is the capital city of France?', options: ['Berlin', 'Rome', 'Paris', 'Madrid'], correctAnswer: 'Paris', explanation: 'Paris is the capital of France and one of the most visited cities globally.' },
        { id: 'q2', question: 'Which river runs through Egypt?', options: ['Amazon', 'Yangtze', 'Nile', 'Danube'], correctAnswer: 'Nile', explanation: 'The Nile is the longest river in Africa and a defining feature of Egypt.' },
        { id: 'q3', question: 'Which desert is the largest hot desert on Earth?', options: ['Gobi', 'Kalahari', 'Sahara', 'Atacama'], correctAnswer: 'Sahara', explanation: 'The Sahara covers much of North Africa and is the largest hot desert in the world.' },
        { id: 'q4', question: 'Which country has the most natural lakes?', options: ['Canada', 'Brazil', 'India', 'Australia'], correctAnswer: 'Canada', explanation: 'Canada contains a large share of the world’s freshwater lakes.' },
        { id: 'q5', question: 'What is the largest ocean on Earth?', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'], correctAnswer: 'Pacific Ocean', explanation: 'The Pacific is the largest and deepest ocean on Earth.' }
      ], 'Easy')
    },
    {
      title: 'Cloud Architecture Basics',
      description: 'Explore key cloud concepts including scalability, reliability, and services.',
      category: 'Cloud Computing',
      difficulty: 'Hard',
      durationMinutes: 20,
      questions: limitQuestions([
        { id: 'q1', question: 'What does IaaS provide?', options: ['Managed business applications', 'Virtualized compute resources over the internet', 'Data analytics dashboards', 'A database schema designer'], correctAnswer: 'Virtualized compute resources over the internet', explanation: 'Infrastructure as a Service supplies virtualized hardware and network resources.' },
        { id: 'q2', question: 'Which cloud feature is most associated with elasticity?', options: ['Static storage', 'Auto-scaling resources based on demand', 'Fixed CPU clock speed', 'Manual backups'], correctAnswer: 'Auto-scaling resources based on demand', explanation: 'Elasticity allows resources to scale up and down as workload changes.' },
        { id: 'q3', question: 'What is the primary purpose of a CDN?', options: ['Host source code repositories', 'Reduce latency by caching content closer to users', 'Encrypt database fields', 'Run backend cron jobs'], correctAnswer: 'Reduce latency by caching content closer to users', explanation: 'A Content Delivery Network serves cached content from edge locations near end users.' },
        { id: 'q4', question: 'Which cloud characteristic supports automatic resource adjustment based on load?', options: ['Reliability', 'Scalability', 'Persistence', 'Virtualization'], correctAnswer: 'Scalability', explanation: 'Scalability enables systems to handle changing demand by allocating resources dynamically.' },
        { id: 'q5', question: 'Why is redundancy important in cloud design?', options: ['It lowers software security', 'It keeps services available if one component fails', 'It removes the need for backups', 'It changes data types automatically'], correctAnswer: 'It keeps services available if one component fails', explanation: 'Redundancy improves resilience and reduces downtime in distributed cloud systems.' }
      ], 'Hard')
    }
  ];

  const toInsert = sampleQuizzes.filter((quiz) => !existingTitles.has(quiz.title));
  if (toInsert.length > 0) {
    await Quiz.insertMany(toInsert);
  }
};
