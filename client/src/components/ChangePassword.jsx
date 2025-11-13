
import "../styles/profile.css"

export default function ChangePassword() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password updated successfully!");
  };

  return (
    <div className="profile_container">
      <div className="profile_box">
        <h2 className="profile_title">Change Password</h2>
        

        <form className="profile_form" onSubmit={handleSubmit}>
         
          <div className="form_group">
            <label className="form_label">Current Password</label>
            <input
              type="text"
              name="currentPassword"
              // value={formData.currentPassword}
              // onChange={handleChange}
              placeholder="Enter your Current Password"
              className="form_input"
            />
          </div>

          <div className="form_group">
            <label className="form_label">New Password</label>
            <input
              type="text"
              name="newPassword"
              // value={formData.newPassword}
              // onChange={handleChange}
              placeholder="Enter your New Password"
              className="form_input"
            />
          </div>
  
          <div className="form_group">
            <label className="form_label">Confirm Password</label>
            <input
              type="text"
              name="confirmPassword"
                placeholder="Enter Confirm Password"
              // value={formData.confirmPassword}
              className="form_input"
            />
          </div>
          <button type="submit" className="btn_primary">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
