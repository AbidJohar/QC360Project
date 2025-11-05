

export default function ChangePassword() {
  return (
 <div className="change_password_container">
      <h2>Change Password</h2>

      <form className="password_form" >
        <div className="form_group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn_primary">
          Change Password
        </button>
      </form>
    </div>
  )
}


