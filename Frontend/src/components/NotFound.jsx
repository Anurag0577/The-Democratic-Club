import logo_img from '../assets/Images/the_democratic_club_logo_white.png';

// Swap this for `react-router-dom`'s <Link to="/"> if your project uses it:
// import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="ndc-404 h-screen bg-black text-white flex flex-col justify-center items-center ">

      <img src={logo_img} alt="The Democratic Club" className="ndc-logo w-37.5 " />

      <div className="ndc-card flex flex-col justify-center items-center w-[90%] flex-1">
          <h1 className="ndc-headline text-4xl font-bold ">Oops! I think we are lost.</h1>
          <p className="ndc-copy mt-1">
            Let's get you back to somewhere familiar
          </p>
            <a href='/login' className='py-2 px-3 text-black bg-white rounded mt-4' >Back to home</a>
        </div>
      </div>
  );
};

export default NotFoundPage;