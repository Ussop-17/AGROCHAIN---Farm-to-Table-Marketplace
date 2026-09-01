# 🌾 Agrochain - Farm-to-Table Marketplace

Agrochain is a full-stack web application designed to streamline the agricultural supply chain by directly connecting farmers, buyers, and delivery agents. The platform eliminates intermediaries, ensures transparent pricing, and provides an efficient logistics system for seamless product delivery.

---

## 🚀 Features

- **Direct Farmer-to-Consumer Connection**: Enables farmers to sell products without intermediaries  
- **Product Management**: Farmers can add, update, and manage product listings  
- **Smart Order Processing**: Buyers can browse, compare, and place orders easily  
- **Integrated Delivery System**: Delivery agents can accept and manage delivery tasks  
- **Role-Based Access Control**: Secure system with Farmer, Buyer, and Delivery roles  
- **Real-Time Data Handling**: Efficient data flow between frontend, backend, and database  

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL / SQL  
- **Architecture**: 3-Tier Web Architecture  
- **Security**: Role-Based Access Control (RBAC)  

---

## 📦 Prerequisites

- Node.js (v16 or higher)  
- npm (Node Package Manager)  
- MySQL (or any SQL database)  

---

## ⚙️ Local Setup

1. **Clone the Repository**
   ```bash
   git clone <your-repo-link>
   cd agrochain
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory  
   - Add required configuration:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=agrochain
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 👥 User Roles

### 🌱 Farmer
- Add, update, and manage products  
- View orders related to their products  

### 🛒 Buyer
- Browse available products  
- Place and track orders  

### 🚚 Delivery Agent
- View available delivery requests  
- Accept and complete deliveries  

---

## 🏗️ System Architecture

The system follows a **3-tier architecture**:

- **Presentation Layer**: User Interface (Frontend)  
- **Application Layer**: Backend APIs and business logic  
- **Data Layer**: Database for storing system data  

---

## 🧠 Workflow

1. User registers and logs in  
2. Farmer lists products  
3. Buyer browses and places an order  
4. Delivery agent accepts the request  
5. Order is delivered and status is updated  

---

## 📊 Future Enhancements

- Online payment integration  
- Real-time GPS tracking  
- AI-based product recommendations  
- Multi-language support  
- Cloud deployment for scalability  

---

## 📝 Note

This project is developed as part of an academic submission and demonstrates the use of web technologies in improving agricultural supply chain efficiency.

---

## 📚 References

- Research papers on Digital Agriculture  
- FAO & World Bank reports  

---

## ⭐ Acknowledgement

Special thanks to our guide and institution for their support and guidance throughout the project development.
