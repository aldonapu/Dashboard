
import "./Settings.scss";
import SettingsImage from "../Settings.svg";
export default function Settings() {
    return (
        <div className="page">
            <div className="page__header">
            </div>
                 <div className="card">
                    <div className="card_content">
                      <h1 className="card_title">Settings</h1>
                      <p className="card_description">
                        Here is a quick overview of your settings. You can manage and update your preferences from this page.
                      </p>
                    </div>
                    <div className="card_image_wrapper">
                      <img
                        src={SettingsImage}
                        alt="Dashboard Illustration"
                        className="card_image"
                      />
                    </div>
                  </div>
        </div>
    );
}
