# Chat Application

This project is a chat application that allows users to send and receive messages in real-time. It is built using a combination of modern web technologies and frameworks to provide a seamless and interactive user experience.

<img width="1494" alt="image" src="https://github.com/user-attachments/assets/b81b02d0-c87d-408f-aa55-a6a4af907987" />

<img width="1494" alt="image" src="https://github.com/user-attachments/assets/4945d479-fd48-48a7-a8f4-4eea87eff0e0" />

<img width="1505" alt="image" src="https://github.com/user-attachments/assets/97a0c6bb-025d-4279-93a2-8237146ad751" />

<img width="1507" alt="image" src="https://github.com/user-attachments/assets/2f2cad19-ebd9-4f3e-8274-7d973b23290f" />

<img width="1503" alt="image" src="https://github.com/user-attachments/assets/5b3c37c3-201b-40af-895a-952be2ae0df7" />

<img width="1503" alt="image" src="https://github.com/user-attachments/assets/a937f998-812c-48f2-8001-45244ebd52f1" />







## Project Structure

- **backend/**: Contains the server-side code, including API endpoints for managing conversations and messages.
  - **app.py**: Main Flask application file that sets up the server and configures CORS.
  - **routes/chat.py**: Defines the API routes for handling chat-related operations such as sending and receiving messages.
  - **db/**: Contains the SQLite database file used for storing user and message data.

- **frontend/**: Contains the client-side code, developed using React and TypeScript.
  - **src/pages/ChatPage.tsx**: Main chat interface where users can view and send messages.

## Tech Stack

- **Frontend**:
  - React: JavaScript library for building user interfaces.
  - TypeScript: Superset of JavaScript that adds static typing.
  - Axios: Promise-based HTTP client for making API requests.
  - Tailwind CSS: Utility-first CSS framework for styling.

- **Backend**:
  - Flask: Micro web framework for Python.
  - Flask-CORS: Extension for handling Cross-Origin Resource Sharing (CORS).
  - SQLAlchemy: SQL toolkit and Object-Relational Mapping (ORM) library for Python.

## Features

- Real-time messaging: Users can send and receive messages instantly.
- Automatic message updates: The chat interface automatically refreshes to display new messages.
- User-friendly interface: Designed to be intuitive and easy to navigate.

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ArtSN7/Atty.git
   ```

2. **Backend Setup**:
   - Navigate to the backend directory and install dependencies:
     ```bash
     cd backend
     pip install -r requirements.txt
     ```
   - Run the Flask server:
     ```bash
     flask run
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory and install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Start the React development server:
     ```bash
     npm run dev
     ```

## Usage

- Access the chat application by navigating to `http://localhost:5173` in your web browser.
- Log in using your credentials to start chatting with other users.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
