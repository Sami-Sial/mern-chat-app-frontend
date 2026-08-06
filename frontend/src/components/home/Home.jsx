import "./stylesheets/home.css";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LogIn from "./LogIn";
import SignUp from "./SignUp";


const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'login' ? 2 : 1;
  const [toggleState, setToggleState] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'login') setToggleState(2);
    else if (tab === 'signup') setToggleState(1);
  }, [searchParams]);

  const toggleTab = (index) => {
    setToggleState(index);
    setSearchParams({ tab: index === 1 ? 'signup' : 'login' });
  };

  return (
    <>
      <div id="container">

        <div id="title">
          <h2>Talk-A-Tive</h2>
        </div>

        <div id="form-container">

          <div id="tabs">
            <button onClick={() => toggleTab(1)} className={toggleState == 1 ? "tab active-tab" : "tab"}>SignUp</button>

            <button onClick={() => toggleTab(2)} className={toggleState == 2 ? "tab active-tab" : "tab"}>LogIn</button>
          </div>
          
          <div id="tabs-content">
            <div className={toggleState == 1 ? "tab-content active-tab-content" : "tab-content"}>
              <SignUp/>
            </div>

            <div className={toggleState == 2 ? "tab-content active-tab-content" : "tab-content"}>
              <LogIn/>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}

export default Home
