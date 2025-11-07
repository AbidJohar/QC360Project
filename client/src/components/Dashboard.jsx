import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
     <>
      <h2 className="font-bold text-2xl">welcome to the dashboard</h2>
      <Link
        to={"/"}
         className="px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-white font-bold"
       >
         Back to Home page
       </Link>
      <Link
        to={"/profile"}
         className=""
       >
       Profile
       </Link>
      <Link
        to={"/changePassword"}
         className="bg-white rounded-2xl text-black"
       >
        Change Password
       </Link>
     </>
    

  )
}
