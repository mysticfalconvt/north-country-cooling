export function Phone() {
  return (
    <div className="mockup-phone justify-self-center">
      <div className="camera"></div>
      <div className="display w-full">
        <div className="artboard artboard-demo phone-1 justify-start">
          <div className="chat chat-end w-full mt-10">
            <div className="chat-bubble chat-bubble-secondary text-secondary-content">
              Who Installed your AC?
            </div>
          </div>
          <div className="chat chat-start w-full">
            <div className="chat-bubble chat-bubble-primary">
              North Country Cooling
            </div>
          </div>
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-primary">
              You should{" "}
              <a href="tel:802-249-4858" className="text-primary-content">
                Call them
              </a>
              {"  "} for a free estimate!
            </div>
          </div>
          <div className="chat chat-end w-full">
            <div className="chat-bubble chat-bubble-secondary text-secondary-content">
              Whats the Number?
            </div>
          </div>
          <div className="chat chat-start w-full">
            <div className="chat-bubble chat-bubble-primary">
              <a href="tel:802-249-4858" className="text-primary-content">
                802-249-4858
              </a>
            </div>
          </div>
          <div className="chat chat-end w-full">
            <div className="chat-bubble chat-bubble-secondary text-secondary-content">
              Thanks!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
