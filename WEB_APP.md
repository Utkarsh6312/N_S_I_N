    # National Scam Intelligence Network (NSIN) - Web Application Documentation

## 1. Product Overview

### Problem Statement
India faces an escalating threat from cyber frauds, phishing attacks, and financial scams. The decentralized nature of reporting and lack of real-time intelligence sharing between citizens, law enforcement, and financial institutions results in delayed action, low conviction rates, and an ever-increasing victim count. 

### Vision
To create India's largest crowd-sourced cyber fraud intelligence platform, empowering citizens to "Report Once, Protect Millions." NSIN aims to become the definitive source of truth for real-time cyber threat intelligence in the nation.

### Target Users
- **Citizens**: To report scams, verify suspicious entities, and stay informed about local threats.
- **Law Enforcement/Nodal Agencies**: To monitor active threats, track geographical patterns, and investigate organized fraud networks.
- **Financial Institutions/Banks**: To receive real-time intelligence on fraudulent UPI IDs, bank accounts, and phone numbers.
- **Cybersecurity Researchers**: To analyze trends, access anonymized datasets, and contribute to threat intelligence.

### User Personas
- **Ramesh (Citizen)**: Receives a suspicious WhatsApp message about an electricity bill update. Wants to verify if the link is safe before clicking.
- **Inspector Sharma (Cyber Cell)**: Needs to track the origin of a new loan scam operating across multiple states and identify the key nodes in the network.
- **Priya (Bank Security Officer)**: Needs a real-time feed of reported UPI IDs to proactively block transactions and protect customers.

### Use Cases
- A user pastes a suspicious URL into the scanner to check its risk score.
- A victim reports a UPI fraud with screenshots of the transaction and chat history.
- An investigator views a heatmap of job scams in Maharashtra over the last 30 days.
- A user searches a phone number to see if it's linked to any reported frauds.

### Expected Impact
- **50% reduction** in average response time to new scam campaigns.
- **Proactive warning** to millions of users via the browser extension.
- **Centralized intelligence repository** for multi-agency coordination.
- **Increased digital literacy** and awareness among citizens.

---

## 2. Functional Requirements

### Citizen Portal
- User Registration & Authentication (Email, Phone OTP).
- Profile Management & History of Reported Scams.
- Dashboard with personalized alerts based on user's location and interests.
- Reward/Gamification system (Trust Score) for accurate reporting.

### Scam Reporting
- Multi-category reporting wizard (Website, UPI, Phone, WhatsApp, Telegram, Social Media, Job, Investment, Loan, E-Commerce).
- Evidence Upload (Images, PDFs, Screenshots).
- Automated OCR (Optical Character Recognition) to extract text, phone numbers, and UPI IDs from uploaded screenshots.

### AI Classification
- Natural Language Processing (NLP) on unstructured report descriptions.
- Automated categorization of the scam type and extraction of key entities (IoCs - Indicators of Compromise).
- Calculation of Threat/Risk Score and Confidence Score.

### URL Scanner
- Input URL for real-time analysis.
- Checks WHOIS data, SSL certificate validity, DNS records, Redirect chains, and public Blacklists.
- AI-based content analysis for phishing keywords and homograph attacks.

### Phone Intelligence
- Search engine for phone numbers.
- Displays report count, associated scam types, risk score, and geographical clustering of reports.

### UPI Intelligence
- Analyze UPI IDs against fraud reports and linked entities.
- Risk score generation for UPI handles to prevent fraudulent transfers.

### Heatmap
- Interactive India Map using Geospatial data.
- Filters: State, District, Scam Type, Date range, Severity.
- Visualizes hotspots, emerging trends, and predictive risk areas.

### Notification System
- Real-time threat feed broadcasting new, high-severity scams.
- Email/SMS alerts for high-risk threats in the user's vicinity or matching their profile.

### Government Dashboard
- Advanced analytics, filtering, and export capabilities (CSV, PDF).
- Fraud Relationship Graph (Node-based visualization of linked entities like IP -> Domain -> Phone -> UPI).
- Admin panel for verifying reports, updating status, and managing users.

---

## 3. Non Functional Requirements

### Performance
- Page load time < 2 seconds for the Web App.
- Support for 10,000+ concurrent users during peak campaigns.
- Sub-second API response time for the URL scanner (critical for extension performance).

### Security
- End-to-end encryption for sensitive user data (PII).
- Rate limiting and DDoS protection (e.g., via Cloudflare).
- Protection against OWASP Top 10 vulnerabilities.
- Regular VAPT (Vulnerability Assessment and Penetration Testing).

### Scalability
- Microservices-ready architecture.
- Auto-scaling Kubernetes clusters.
- Database sharding and read replicas to handle massive read-heavy workloads (searches/scans).

### Reliability
- 99.99% uptime SLA.
- Multi-AZ (Availability Zone) deployment for high availability.
- Automated daily backups and point-in-time recovery.

### Accessibility
- WCAG 2.1 AA compliance.
- Screen reader support and keyboard navigation.
- Multi-lingual support (English, Hindi, and major regional languages).

---

## 4. System Architecture

### Architecture Diagram
*(Conceptual)*
`Client (Web/Extension) -> Load Balancer/CDN -> API Gateway -> Backend Services (Auth, Core API, Intelligence, Analytics) -> Message Queue (Redis/Kafka) -> Background Workers (OCR, AI, Scrapers)`
`Databases: MongoDB (NoSQL), Redis (Caching), Elasticsearch (Search), S3 (Storage).`

### Data Flow Diagram
1. User submits report via Web App -> API validates payload -> Saves to Database -> Publishes event to Queue.
2. AI Worker picks event -> Runs OCR on images -> Extracts entities -> Queries LLM for classification -> Updates Risk Scores -> Triggers Notification Service.
3. Dashboard queries read-replica/Elasticsearch for real-time analytics and Graph visualizations.

### Component Diagram
- **Frontend**: Next.js App, Tailwind CSS, Mapbox/Leaflet (Heatmap), Recharts (Charts).
- **Backend**: NestJS, Prisma ORM, BullMQ for task queues.
- **AI Services**: LangChain, OpenAI/Gemini APIs, Tesseract (OCR).

### Service Diagram
- **Auth Service**: JWT generation, OTP validation, RBAC (Role-Based Access Control).
- **Ingestion Service**: Report handling, data sanitization, file uploads.
- **Intelligence Service**: Domain, Phone, UPI scoring and external API integrations (WHOIS, Safe Browsing).
- **Notification Service**: Websockets, Email (SendGrid), SMS integration.

---

## 5. Tech Stack Justification

- **Frontend: Next.js 15 (React, TypeScript)**. Provides Server-Side Rendering (SSR) for excellent SEO, fast initial page loads, and highly interactive dashboards. TypeScript ensures type safety across the monorepo.
- **UI/Styling: Tailwind CSS, ShadCN, Framer Motion**. Enables rapid development of a premium, cohesive "cyber-intelligence" aesthetic. Framer Motion provides the fluid micro-animations required for a world-class UI.
- **Backend: NestJS (Node.js, TypeScript)**. A highly structured, scalable, and maintainable enterprise-grade framework. Excellent for building robust APIs with built-in dependency injection and modularity.
- **Database: MongoDB & Mongoose (or Prisma ORM with MongoDB)**. MongoDB provides a flexible, scalable NoSQL document structure ideal for handling unstructured and varied report data and threat intelligence.
- **Caching & Queues: Redis**. Essential for caching high-frequency URL lookups, rate limiting, and powering BullMQ for background tasks (like OCR and AI processing).
- **Search: Elasticsearch**. Required for blazing-fast full-text search across millions of reports and log analytics.
- **Storage: AWS S3**. For scalable, durable, and cost-effective storage of user-uploaded evidence (images, PDFs).
- **AI: LangChain & LLMs**. LangChain orchestrates complex prompts and chains for extracting entities from unstructured text, utilizing models like GPT-4o or Gemini 1.5 Pro.
- **Infrastructure: Docker & Kubernetes**. Container orchestration ensures consistent environments, auto-scaling, and self-healing.

---

## 6. Database Design

### Document Data Model Overview
The core of the system revolves around `Reports` and `Entities`. An `Entity` can be a Phone Number, URL, or UPI ID. Since MongoDB is a NoSQL database, `Reports` will embed `Evidences` directly, and we will use arrays of references to link `Reports` and `Entities` to build the Fraud Relationship Graph.

### Collections (Simplified Schemas)
- **Users**: `_id`, `name`, `email`, `passwordHash`, `role`, `trustScore`, `createdAt`
- **Reports**: `_id`, `userId` (Ref), `title`, `description`, `category`, `status`, `location` (GeoJSON Point), `entities` (Array of Refs), `evidences` (Array of Subdocuments: `fileUrl`, `fileType`, `ocrText`), `createdAt`
- **Entities**: `_id`, `type` (URL, PHONE, UPI), `value`, `riskScore`, `isVerified`, `lastScannedAt`, `reportIds` (Array of Refs)

### Relationships
- `User` (1) -> (N) `Report` (via `userId` reference)
- `Report` embeds `Evidence`
- `Report` and `Entity` maintain a Many-to-Many relationship using arrays of references.

### Indexes
- Unique Index on `Users.email`.
- Unique Index on `Entities.value`.
- Index on `Reports.category` and `Reports.status`.
- 2dsphere Geospatial Index on `Reports.location` for optimized Heatmap queries.

---

## 7. API Documentation (Key Endpoints)

- `POST /api/v1/auth/register` - Register a new citizen account.
- `POST /api/v1/auth/login` - Authenticate and receive JWT.
- `POST /api/v1/reports` - Submit a new scam report with evidence. (Auth required)
- `GET /api/v1/reports/:id` - Fetch detailed report view.
- `GET /api/v1/intelligence/scan?url={url}` - Real-time URL risk analysis. Used heavily by the extension.
- `GET /api/v1/intelligence/phone/{number}` - Get phone number threat intel.
- `GET /api/v1/analytics/heatmap` - Fetch clustered data points for the interactive map.
- `GET /api/v1/analytics/graph?entityId={id}` - Fetch node/edge data for the fraud relationship graph.

---

## 8. UI Screens

### Landing Page
- **Purpose**: Introduce the platform, provide immediate value via the universal search bar, and encourage sign-ups.
- **Components**: Hero section with Search Bar (URL/Phone/UPI), Live Ticker of recently thwarted scams, dynamic 3D globe or stylized heatmap, Testimonials/Stats.
- **Aesthetic**: Deep Navy background, Neon Cyan accents, glassmorphism cards.

### Dashboard (Citizen)
- **Purpose**: Central hub for the user to track their reports and local threats.
- **Components**: Risk Index for their city, Recent Reports table, "Report a Scam" FAB (Floating Action Button), Trust Score gauge.

### Scam Reporting Wizard
- **Purpose**: A frictionless, multi-step form to gather structured data.
- **Components**: Stepper (1. Category -> 2. Details -> 3. Entities -> 4. Evidence). Drag-and-drop file upload. Dynamic form fields based on category.

### Entity Profile Page
- **Purpose**: Detailed breakdown of a specific URL, Phone, or UPI ID.
- **Components**: Large Risk Gauge (Safe/Suspicious/Dangerous), AI Summary Explanation, WHOIS/Technical Data accordion, List of associated reports.

### Scam Heatmap
- **Purpose**: Visualizing the spread of cybercrime.
- **Components**: Full-screen Mapbox instance. Floating sidebar for filters (Date, Category, State). Hover tooltips on hotspots.

### Government Dashboard
- **Purpose**: Professional tools for investigation and management.
- **Components**: Data tables with bulk actions, Fraud Relationship Graph canvas, Report verification workflow.

---

## 9. AI Architecture

### Scam Classification
User inputs unstructured description -> Passed to LangChain -> Prompt engineered for Zero-shot classification -> Output parsed into structured JSON (Category, Sub-category, Extracted Entities, Modus Operandi).

### Threat Scoring Algorithm
A weighted algorithm combining:
1. **AI Confidence Score** (How certain is the LLM?)
2. **Community Trust** (Number of independent reports, weighted by the reporters' trust scores).
3. **External Intelligence** (Hits on Google Safe Browsing, VirusTotal, spam lists).
4. **Technical Indicators** (Domain age < 30 days, invalid SSL, IP originating from high-risk ASN).

### Pattern Recognition & Fraud Clustering
Using NLP embeddings (e.g., text-embedding-3-small) on report descriptions. We run clustering algorithms (like DBSCAN) to group similar reports automatically, identifying new, emerging scam campaigns even if they use different phone numbers or domains.

---

## 10. Security Architecture

- **OWASP Top 10 Mitigation**: Protection against NoSQL Injection (via Mongoose/Prisma validation), XSS (via React's default escaping and strict CSP), CSRF (via SameSite cookies and tokens).
- **Authentication**: JWT with short expiration and HTTP-only refresh cookies.
- **Data Privacy**: PII (Personally Identifiable Information) encryption at rest. Anonymization of data before feeding to the Heatmap or external APIs.
- **CERT-In Guidelines**: Strict audit logging of all administrative actions. Data residency strictly within India (AWS ap-south-1).

---

## 11. Deployment Architecture

- **Docker**: All services (Frontend, API, Workers) containerized using multi-stage Dockerfiles for optimized image sizes.
- **Kubernetes**: Deployed via Helm charts. Ingress controller (Nginx) for routing traffic. Horizontal Pod Autoscaler (HPA) configured based on CPU/Memory usage.
- **CI/CD**: GitHub Actions workflow. On push to `main` -> Run Tests -> Lint -> Build Docker Images -> Push to Container Registry -> Apply K8s manifests.
- **Monitoring & Logging**: Prometheus for metrics collection, Grafana for dashboards. ELK stack (Elasticsearch, Logstash, Kibana) for centralized logging of application and access logs.

---

## 12. Future Scope (2-Year Roadmap)

- **Phase 1 (Months 1-3)**: Core Web App, Reporting Engine, and Browser Extension Launch.
- **Phase 2 (Months 4-6)**: Advanced AI Clustering, Graph Database integration (Neo4j) for deep relationship mapping.
- **Phase 3 (Months 7-12)**: Integration with National Cyber Crime Reporting Portal (NCRP) APIs for bi-directional data flow. Launch of Mobile App (iOS/Android) with native incoming call screening.
- **Phase 4 (Year 2)**: Enterprise APIs for Banks and Telecom operators to automatically block flagged entities. Decentralized identity integration for anonymous, verified reporting.
