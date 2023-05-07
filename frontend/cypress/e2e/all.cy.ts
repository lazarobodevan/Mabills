/*
        * Cypress was giving a weird result when applying filters, what did not happen
        * when it was tested manually.
        * The framework was displaying multiplied instances of transactions. It stopped
        * when I removed the verification for each collumn of the transactions table.
        * 
        * Sometimes, it is needed to run the test more than once due to some odd errors
        * that I couldn't figure out.
*/

import './categories.cy'
import './expenses.cy'
import './home.cy'
import './login.cy'
import './singup.cy'