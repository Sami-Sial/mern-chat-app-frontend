import React from "react";
import logo from "../assets/logo.png";

export default function Preview() {
    return (
        <div className="vc-anim-wrapper">
            <div className="vc-logo">
                <div className="vc-circle">
                    <img src={logo} alt="" style={{ width: "95%", height: "95%", borderRadius: "50%" }} />
                </div>

                {/* Pulse Rings */}
                <span className="ring r1" />
                <span className="ring r2" />
                <span className="ring r3" />
            </div>

            <div className="vc-text">
                Talk-A-Tive
                <p className="vc-sub">Please wait — preparing things for you...</p>
            </div>

            <style>{`
      .vc-anim-wrapper{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        width:100vw;
        height:100vh;
        background:#111b21;
        color:white;
        text-align:center;
        gap:16px;
      }

      .vc-logo{
        position:relative;
        width:200px;
        height:200px;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .vc-circle{
        width:100%;
        height:100%;
        border-radius:50%;
        background:linear-gradient(135deg,#25D366 0%, #128C7E 100%);
        display:flex;
        align-items:center;
        justify-content:center;
        animation:pulse 2.2s ease-in-out infinite;
        box-shadow:0 12px 30px rgba(0,0,0,0.25);
      }

      .ring{
        position:absolute;
        border-radius:50%;
        border:2px solid rgba(37,211,102,0.4);
        animation: ripple 2.6s infinite ease-out;
      }

      .r1{ width:160px; height:160px; animation-delay:0s }
      .r2{ width:200px; height:200px; animation-delay:.4s }
      .r3{ width:240px; height:240px; animation-delay:.8s }

      .vc-text{
        font-size:22px;
        font-weight:700;
        letter-spacing:1px;
        color:white;
      }

      .vc-sub{
        margin-top:6px;
        font-size:14px;
        opacity:0.8;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 15px #25D36655;
        }

        50% {
          transform: scale(1.05);
          box-shadow: 0 0 35px #25D366aa;
        }

        100% {
          transform: scale(1);
          box-shadow: 0 0 15px #25D36655;
        }
      }

      @keyframes ripple{
        0%{ transform:scale(0.8); opacity:0.6 }
        70%{ opacity:0 }
        100%{ transform:scale(1.5); opacity:0 }
      }
      `}</style>
        </div>
    );
}