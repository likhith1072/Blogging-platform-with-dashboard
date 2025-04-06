import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store ,persistor} from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './components/ThemeProvider.jsx';
// import { ChakraProvider } from "@chakra-ui/react";


createRoot(document.getElementById('root')).render(
 
  // <ChakraProvider>
   <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
    </PersistGate>
  // </ChakraProvider>  
   
);
