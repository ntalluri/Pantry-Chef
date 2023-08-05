import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Components
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import Favorites from './components/Favorites';
import NavBar from './components/NavBar';
import Logout from './components/Logout';
import Recipe from './components/Recipe';
import AddRecipe from './components/AddRecipe';

// Contexts
import userLoggedIn from './context/userLoggedIn';

const App = () => {

  // the array that holds the selected ingredients by the user
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  //will be filled with recipes when the recipes are returned by the backend
  const [recipes, setRecipes] = useState({})

  // for setting the userName to sessionStorage
  const isLoggedIn = JSON.parse(sessionStorage.getItem("loggedIn"));
  const [loggedIn, setLoggedIn] = useState(isLoggedIn !== null ? isLoggedIn : null);


  // for setting the userName to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("loggedIn", JSON.stringify(loggedIn))
  }, [loggedIn])

  const login = async (credentials) => {

    if (credentials.username === '' || credentials.password === '') {
      alert('Empty values. Please input a valid username and password.');
      return;
    }

    // logic to backend
    fetch("http://localhost:8000/login", {
      method: "POST",
      body: JSON.stringify({
        "username": credentials.username,
        "password": credentials.password,
      }),

    }).then(res => {

      if (res.status === 401) {
        alert('Incorrect username or password!')
        return false;
      }
      else if (res.status === 200) {
        return res.json()
      } else if (res.status === 500) {
        alert('unknown error')
        return false;
      }
    }).then(json => {

      if (json == false) {
        return;
      }
      else {
        console.log(json) // delete later
        setLoggedIn(json.username)
        // expected json:
        // {username: 'username_of_user'}
      }
    })

  };

  const register = async (credentials) => {

    if (credentials.password === '' || credentials.username === '') {
      alert('You must provide both a username and password!')
      return
    }

    if (credentials.password !== credentials.passwordConfirm) {
      alert("Your passwords do not match!");
      return
    }

    // check if userName is > 50 chars
    if (credentials.username.length > 50) {
      alert("Your username must be less than 50 characters")
      return
    }

    if (credentials.username.includes(' ') || credentials.password.includes(' ')) {
      alert("Your username and password cannot contain whitespace")
      return
    }
    // I can add more checks as needed

    fetch("http://localhost:8000/register", {
      method: "POST",
      body: JSON.stringify({
        "username": credentials.username,
        "password": credentials.password,
      }),

    }).then(res => {

      if (res.status === 401) {
        alert('username already in use!')
        return false;
      }
      else if (res.status === 200) {
        return res.json()

      } else if (res.status === 405) {
        alert('unknown error')
        return false;
      }
    }).then(json => {

      if (json == false) {
        return;
      }
      else {
        setLoggedIn(json.username)
        // expected json:
        // {username: 'username_of_user'}
      }
    })

    // remove later just need it to work for now
    setLoggedIn(credentials.username)
  };

  const logout = async () => {
    setLoggedIn(null)
  }

  function submitIngredients(ingredients) {

    // for now just set the ingredients and send to recipe.jsx
    setSelectedIngredients(ingredients);

    // logic to get recipes from database
    fetch("http://localhost:8000/search", {
      method: "POST",
      body: JSON.stringify({
        ingredients: selectedIngredients, // sends array of ingredients
      }),

    }).then(res => {

      if (res.status === 401) {
        alert('no recipes with these ingredients')
        return false;
      }
      else if (res.status === 200) {
        return res.json()

      } else if (res.status === 405) {
        alert('unknown error')
        return false;
      }
    }).then(json => {

      if (json == false) {
        return;
      }
      else {
        // get the recipes and send them to the recipe page
        setRecipes(json.recipes)

        // expected json back
        // {
        //   "recipes": [
        //     {
        //       "name": "Recipe 1",
        //       "recipeID": 1
        //       "ingredients": ["Ingredient 1", "Ingredient 2"]
        //        ...
        //     },
        //     {
        //       "name": "Recipe 2",
        //       "recipeID": 2
        //       "ingredients": ["Ingredient 3", "Ingredient 4"]
        //        ...
        //     },
        //    ...
        //   ]
        // }

      }
    })

    // will also need to then send the recipes along with ingredients to recipe.jsx
  };

  return (
    <userLoggedIn.Provider value={[loggedIn, setLoggedIn]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onRegister={register} />} />
            <Route path="/search" element={<Search onSubmit={submitIngredients} />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/logout" element={<Logout onLogout={logout} />} />
            <Route path="/recipe" element={<Recipe ingredients={selectedIngredients} />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </userLoggedIn.Provider>
  );
};

export default App;
