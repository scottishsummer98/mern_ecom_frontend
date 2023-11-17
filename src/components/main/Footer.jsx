import React, { Component } from "react";
import { BiCopyright } from "react-icons/bi";
import { BsFacebook, BsTwitter, BsLinkedin, BsTelegram } from "react-icons/bs";

export class Footer extends Component {
  render() {
    return (
      <div className="footer_container">
        <div className="footer_columns">
          <div className="footer_items">
            <div className="footer_header_text">Mern Ecom</div>
            <div>
              <BiCopyright />
              <a
                className="footer_creator_github"
                href="https://github.com/scottishsummer98"
              >
                scottishsummer98
              </a>
            </div>
          </div>
          <div className="footer_items">
            <div className="footer_header_text">About</div>
            <div className="footer_items_columns">
              <div className="footer_items">
                <div className="footer_body_text">Hotels</div>
                <div className="footer_body_text">Services</div>
                <div className="footer_body_text">Booking</div>
              </div>
              <div className="footer_items">
                <div className="footer_body_text">Reviews</div>
                <div className="footer_body_text">FAQs</div>
                <div className="footer_body_text">Help Center</div>
              </div>
            </div>
          </div>
          <div className="footer_items">
            <div className="footer_header_text">Further Information</div>
            <div className="footer_body_text">Terms & Condition</div>
            <div className="footer_body_text">Privacy Policy</div>
          </div>
          <div className="footer_items">
            <div className="footer_header_text">Follow Us</div>
            <div className="footer_socials">
              <div className="footer_body_text">
                <BsFacebook />
              </div>
              <div className="footer_body_text">
                <BsTwitter />
              </div>
              <div className="footer_body_text">
                <BsLinkedin />
              </div>
              <div className="footer_body_text">
                <BsTelegram />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
