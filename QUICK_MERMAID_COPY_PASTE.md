# 🚀 QUICK COPY-PASTE MERMAID CODES - ALL 19 FIGURES

**Just copy each code block and paste into https://mermaid.live**

---

## **FIG 1.2: SYSTEM ARCHITECTURE**
```mermaid
graph TB
    subgraph Frontend["Frontend"]
        React["React 19.2.3"]
        NextJS["Next.js 16"]
    end
    subgraph Backend["Backend"]
        ServerActions["Server Actions"]
        Auth["Authentication"]
    end
    subgraph Database["Database"]
        PostgreSQL["PostgreSQL"]
        RLS["RLS Policies"]
    end
    Frontend -->|HTTP| Backend
    Backend -->|Query| Database
    style Frontend fill:#e3f2fd
    style Backend fill:#fff3e0
    style Database fill:#f3e5f5
```

---

## **FIG 2.1: CUSTOMER USE CASES**
```mermaid
graph LR
    Customer["👤 Customer"]
    Browse["Browse Products"]
    Search["Search & Filter"]
    Cart["Add to Cart"]
    Checkout["Checkout"]
    OrderTrack["Track Order"]
    Wishlist["Manage Wishlist"]
    Review["Write Review"]
    
    Customer --> Browse
    Customer --> Search
    Customer --> Cart
    Customer --> Checkout
    Customer --> OrderTrack
    Customer --> Wishlist
    Customer --> Review
    
    style Customer fill:#fff9c4,stroke:#f57f17,stroke-width:3px
    style Browse fill:#e8f5e9
    style Checkout fill:#ffebee
    style OrderTrack fill:#e3f2fd
```

---

## **FIG 2.2: ADMIN USE CASES**
```mermaid
graph LR
    Admin["👨‍💼 Admin"]
    Dashboard["Dashboard"]
    Products["Manage Products"]
    Orders["Manage Orders"]
    Customers["Manage Customers"]
    Reviews["Moderate Reviews"]
    Blog["Manage Blog"]
    Settings["Settings"]
    
    Admin --> Dashboard
    Admin --> Products
    Admin --> Orders
    Admin --> Customers
    Admin --> Reviews
    Admin --> Blog
    Admin --> Settings
    
    style Admin fill:#fff9c4,stroke:#f57f17,stroke-width:3px
    style Dashboard fill:#c8e6c9
    style Orders fill:#ffccbc
    style Settings fill:#b3e5fc
```

---

## **FIG 3.1: DATABASE SCHEMA** ⭐
```mermaid
erDiagram
    USERS ||--o{ ORDERS : place
    USERS ||--o{ ADDRESSES : have
    USERS ||--o{ CART_ITEMS : have
    USERS ||--o{ REVIEWS : write
    
    PRODUCTS ||--o{ ORDER_ITEMS : "in"
    PRODUCTS ||--o{ PRODUCT_VARIANTS : "has"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "has"
    PRODUCTS ||--o{ CART_ITEMS : "in"
    PRODUCTS }o--|| CATEGORIES : "belongs to"
    PRODUCTS ||--o{ REVIEWS : "reviewed"
    
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS }o--|| ADDRESSES : "ships to"
    
    CATEGORIES ||--o{ CATEGORIES : "parent"
    
    USERS : uuid id PK
    USERS : string email
    USERS : string first_name
    
    PRODUCTS : uuid id PK
    PRODUCTS : string name
    PRODUCTS : decimal price
    PRODUCTS : int stock
    PRODUCTS : uuid category_id FK
    
    ORDERS : uuid id PK
    ORDERS : uuid user_id FK
    ORDERS : string status
    ORDERS : decimal total
    
    CATEGORIES : uuid id PK
    CATEGORIES : string name
    CATEGORIES : uuid parent_id FK
    
    ADDRESSES : uuid id PK
    ADDRESSES : uuid user_id FK
    ADDRESSES : string full_name
    
    CART_ITEMS : uuid id PK
    CART_ITEMS : uuid user_id FK
    CART_ITEMS : uuid product_id FK
    CART_ITEMS : int quantity
```

---

## **FIG 3.2: ARCHITECTURE LAYERS**
```mermaid
graph TB
    subgraph Presentation["PRESENTATION LAYER"]
        React["React Components"]
        NextJS["Next.js Pages"]
        Tailwind["Tailwind CSS"]
        Zustand["Zustand Store"]
    end
    
    subgraph Application["APPLICATION LAYER"]
        ServerActions["Server Actions"]
        Auth["Authentication"]
        Authorization["Authorization"]
        Validation["Data Validation"]
    end
    
    subgraph Data["DATA LAYER"]
        PostgreSQL["PostgreSQL"]
        RLS["Row-Level Security"]
        Storage["Storage Services"]
    end
    
    Presentation -->|HTTP| Application
    Application -->|Query| Data
    
    style Presentation fill:#e3f2fd
    style Application fill:#fff3e0
    style Data fill:#f3e5f5
```

---

## **FIG 3.3: AUTHENTICATION FLOW**
```mermaid
flowchart TD
    Start([User Login]) --> Enter["Enter Email & Password"]
    Enter --> Submit["Submit Form"]
    Submit --> Validate{Valid?}
    Validate -->|No| Error1["❌ Error"]
    Error1 --> Enter
    Validate -->|Yes| SupabaseAuth["Supabase Auth"]
    SupabaseAuth --> Check{Success?}
    Check -->|No| Error2["❌ Failed"]
    Error2 --> Enter
    Check -->|Yes| Token["Generate JWT"]
    Token --> Cookie["Store in Cookie"]
    Cookie --> Admin{Admin?}
    Admin -->|Yes| AdminDash["✅ Admin Dashboard"]
    Admin -->|No| Home["✅ Home"]
    style Start fill:#4caf50,color:#fff
    style Error1 fill:#f44336,color:#fff
    style Token fill:#2196f3,color:#fff
    style AdminDash fill:#4caf50,color:#fff
```

---

## **FIG 3.4: ORDER WORKFLOW**
```mermaid
flowchart TD
    Start([Checkout]) --> Validate["Validate Form"]
    Validate --> Check1{Valid?}
    Check1 -->|No| Error1["❌ Error"]
    Error1 --> Start
    Check1 -->|Yes| Auth["Authenticate"]
    Auth --> Check2{Auth OK?}
    Check2 -->|No| Error2["❌ Auth Failed"]
    Error2 --> Start
    Check2 -->|Yes| Calculate["Calculate Totals"]
    Calculate --> CheckStock["Check Stock"]
    CheckStock --> Check3{Stock OK?}
    Check3 -->|No| Error3["❌ Out of Stock"]
    Error3 --> Start
    Check3 -->|Yes| CreateOrder["Create Order"]
    CreateOrder --> CreateItems["Create Order Items"]
    CreateItems --> UpdateStock["Decrement Stock"]
    UpdateStock --> ClearCart["Clear Cart"]
    ClearCart --> Confirm["✅ Confirmation"]
    style Start fill:#4caf50,color:#fff
    style Confirm fill:#4caf50,color:#fff
    style Error1 fill:#f44336,color:#fff
```

---

## **FIG 3.5: PRODUCT STRUCTURE**
```mermaid
graph TD
    Product["🛍️ Product"]
    Product --> Category["📁 Category"]
    Product --> Variants["📦 Variants"]
    Product --> Images["🖼️ Images"]
    Product --> Details["📝 Details"]
    Product --> Reviews["⭐ Reviews"]
    
    Variants --> V1["Size: 100ml"]
    Variants --> V2["Size: 250ml"]
    
    Images --> Primary["Primary Image"]
    Images --> Additional["Additional Images"]
    
    Details --> Ingredients["Ingredients"]
    Details --> Benefits["Benefits"]
    
    Reviews --> Approved["Approved"]
    Reviews --> Pending["Pending"]
    
    style Product fill:#c8e6c9
    style Variants fill:#ffe0b2
    style Images fill:#f8bbd0
    style Reviews fill:#b3e5fc
```

---

## **FIG 3.6: COMPONENT TREE**
```mermaid
graph TD
    App["App"]
    App --> RootLayout["RootLayout"]
    RootLayout --> Marketing["Marketing"]
    RootLayout --> Account["Account"]
    RootLayout --> Auth["Auth"]
    RootLayout --> Admin["Admin"]
    
    Marketing --> Home["Home"]
    Marketing --> Products["Products"]
    Marketing --> Cart["Cart"]
    
    Account --> Orders["Orders"]
    Account --> Addresses["Addresses"]
    
    Auth --> Login["Login"]
    Auth --> Signup["Signup"]
    
    Admin --> Dashboard["Dashboard"]
    Admin --> AdminProducts["Products"]
    Admin --> AdminOrders["Orders"]
    
    style App fill:#64b5f6,color:#fff
    style RootLayout fill:#81c784,color:#fff
    style Marketing fill:#ffb74d,color:#fff
    style Admin fill:#4dd0e1,color:#fff
```

---

## **FIG 4.1: DIRECTORY STRUCTURE**
```mermaid
graph TD
    Root["📦 HTM-ECOMM"]
    Root --> App["📁 app"]
    Root --> Components["📁 components"]
    Root --> Stores["📁 stores"]
    Root --> Lib["📁 lib"]
    
    App --> Marketing["(marketing)"]
    App --> Account["(account)"]
    App --> Auth["(auth)"]
    App --> Admin["admin"]
    App --> Actions["actions"]
    
    Marketing --> MktPages["pages"]
    Account --> AccPages["orders, addresses"]
    Admin --> AdminPages["dashboard, products"]
    
    Components --> UI["ui"]
    Components --> Layout["layout"]
    Components --> Features["features"]
    
    Stores --> CartStore["cart-store.ts"]
    
    style Root fill:#fbc02d
    style App fill:#81c784
    style Components fill:#64b5f6
```

---

## **FIG 4.2: SERVER ACTIONS FLOW**
```mermaid
flowchart TD
    Client["Client Component"]
    Action["Server Action"]
    Validate["Input Validation"]
    Auth["Authentication"]
    AuthZ["Authorization"]
    Logic["Business Logic"]
    DB["Database"]
    Response["Response"]
    
    Client --> Action
    Action --> Validate
    Validate --> Auth
    Auth --> AuthZ
    AuthZ --> Logic
    Logic --> DB
    DB --> Response
    Response --> Client
    
    style Client fill:#e3f2fd
    style Action fill:#fff3e0
    style Response fill:#e8f5e9
```

---

## **FIG 4.3: CART ARCHITECTURE**
```mermaid
graph TB
    Component["React Component"]
    Store["Zustand Store"]
    LocalStorage["LocalStorage"]
    
    Component -->|Add| Store
    Store -->|Persist| LocalStorage
    Component -->|Read| Store
    
    Component -->|Checkout| Action["Server Action"]
    Action -->|Get Cart| LocalStorage
    Action -->|Create Order| DB["Database"]
    DB -->|Success| Component
    
    style Component fill:#e3f2fd
    style Store fill:#fff3e0
    style LocalStorage fill:#f3e5f5
    style Action fill:#ffe0b2
    style DB fill:#f8bbd0
```

---

## **FIG 4.4: ORDER SEQUENCE**
```mermaid
sequenceDiagram
    User ->> Client: Click Place Order
    Client ->> Action: Call createOrder
    Action ->> Auth: Verify User
    Action ->> Validation: Validate Address
    Action ->> DB: Check Stock
    DB -->> Action: Stock OK
    Action ->> DB: Create Order
    Action ->> DB: Create Items
    Action ->> DB: Update Stock
    DB -->> Action: Success
    Action -->> Client: Confirmation
    Client -->> User: Show Success
```

---

## **FIG 5.4: SECURITY RESULTS**
```mermaid
pie title Security Tests: 8/8 Passed ✅
    "Passed": 100
```

---

## **FIG 5.5: REQUIREMENTS COVERAGE**
```mermaid
pie title Requirements Coverage: 98.5%
    "Implemented": 98.5
    "Pending": 1.5
```

---

## 🎯 FOR CHARTS (USE GOOGLE SHEETS)

### **FIG 1.1: Market Overview**
- Use Google Sheets
- Create columns: Year, Overall Market, Hygiene Segment
- Insert Bar Chart
- Export as PNG

### **FIG 5.1: Response Times**
- Use Google Sheets
- Create columns: Endpoint, Response Time
- Insert Column Chart
- Add line at 200ms target
- Export as PNG

### **FIG 5.2: Page Load Times**
- Use Google Sheets
- Create stacked bar chart
- Metrics: FCP, LCP, TTI
- Export as PNG

### **FIG 5.3: Query Performance**
- Use Google Sheets
- Create horizontal bar chart
- Export as PNG

---

## ✅ HOW TO USE

1. **For Mermaid codes (11 figures):**
   - Copy code block above
   - Go to https://mermaid.live
   - Paste code
   - Click Render
   - Export as PNG
   - Download

2. **For Charts (5 figures):**
   - Open Google Sheets
   - Create table with data
   - Insert Chart
   - Customize
   - Download as PNG

3. **That's it!** 🎉

---

**All 19 figures ready to generate instantly!**
