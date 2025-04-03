"use client";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
const WordMaintainTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);
  const [myUrl, setMyUrl] = useState('');
  const [myemail, setMyemail] = useState('');

  const handlePurchaseClick = (costs) => {
    setSelectedCost(costs);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Clean up any PayPal elements when closing
    const container = document.getElementById("paypal-button-container");
    if (container) {
      container.innerHTML = "";
    }
  };

  // const handleHubspot = (result) => {
  //   if (!result) {
  //     return;
  //   }
  // };


  const handleBtnClick = ()=>{
    
    initializePaypal();
  }

  const initializePaypal = () => {
    // Clean any existing buttons first
    const container = document.getElementById("paypal-button-container");
    if (container) {
      container.innerHTML = "";
    }

    // Load PayPal SDK script dynamically
    const script = document.createElement("script");
    script.src = `https://www.sandbox.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&components=buttons`;
    script.async = true;

    // Remove any existing PayPal scripts to avoid conflicts
    const existingScript = document.querySelector(
      'script[src*="sandbox.paypal.com/sdk/js"]'
    );
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    document.body.appendChild(script);

    script.onload = () => {
      // Initialize PayPal Buttons
      let isCanceled = false;
      window.paypal
        .Buttons({
          createOrder: async (data, actions) => {
            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ costs: selectedCost , email: myemail , url: myUrl}), // Use the selected cost
            });

            const { orderID } = await response.json();
            return orderID;
          },
          onApprove: async (data, actions) => {
            isCanceled = false;
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              body: JSON.stringify({ orderID: data.orderID }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const result = await response.json();
            // console.log('my result >>>',result)
            if (result) {
              handleCloseModal(); // Close the modal after successful payment
            
              router.push("/payment-recieved");
            } else {
              console.error("Payment capture failed:", result.error);
            }
          },
          onCancel: (data) => {
            isCanceled = true;
            console.log("Payment was cancelled by the user:");
            // You might want to keep the modal open here
          },
          onError: (err) => {
            if (isCanceled) {
              console.log("Error triggered by user cancelation. Ignoring.");
              return; // Ignore errors triggered by cancelation
            }
            console.error("PayPal Error: ", err);
          },
        })
        .render("#paypal-button-container"); // Render in the container inside modal
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  };

  return (
    <section className="wordpress-maintenance-package py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-0 mx-auto col-12 heading-main text-center mb-4 mb-5">
            <h2 className="mb-2">
              Our <span>WordPress Maintenance Plans</span>
            </h2>
            <p>
              We offer flexible maintenance plans tailored to your business
              needs. Whether you need basic updates or a comprehensive
              maintenance package, WebGuruz Technologies Pvt Ltd provides
              reliable solutions that fit your budget. Contact us to discuss the
              best plan for your website.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="thead-dark">
                  <tr>
                    <th className="first-th">
                      <p className="first-paragraph">
                        Feature <br /> <span>Cost</span>
                      </p>
                    </th>
                    <th>
                      <p>
                        Economy <br /> <span>$55 Monthly</span>
                      </p>
                    </th>
                    <th>
                      <p>
                        Business <br /> <span>$99 Monthly</span>
                      </p>
                    </th>
                    <th>
                      <p>
                        Enterprise <br /> <span>$299 Monthly</span>
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Backups", "Weekly", "Daily", "Daily"],
                    ["Cloud Backups", "Monthly", "Fortnightly", "Daily"],
                    ["Core Updates", "Monthly", "Fortnightly", "Weekly"],
                    ["Plugin Updates", "Monthly", "Fortnightly", "Weekly"],
                    [
                      "Discount on WordPress Support*",
                      "10% (valued at $11pm)",
                      "20% (valued at $33pm)",
                      "30% (valued at $33pm)",
                    ],
                    ["Free Business Hosting", "Yes", "Yes", "Yes"],
                    ["Theme Updates", "Yes", "Yes", "Yes"],
                    ["Maintenance Reports", "Yes", "Yes", "Yes"],
                    ["Optimisation", "No", "No", "No"],
                    ["Uptime Monitoring", "No", "No", "No"],
                    ["Security Scanning", "No", "No", "No"],
                    ["SEO Rank Tracking", "No", "No", "No"],
                    ["Performance Benchmarks", "No", "No", "No"],
                    ["Licence Management", "No", "No", "No"],
                    ["Automatic Updates for Latest Version", "No", "No", "No"],
                    ["Content Updation", "No", "No", "No"],
                    ["24x7 Support", "No", "No", "No"],
                  ].map(([feature, economy, business, enterprise], index) => (
                    <tr key={index}>
                      <td>{feature}</td>
                      <td>{economy}</td>
                      <td>{business}</td>
                      <td>{enterprise}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Purchase</td>
                    <td>
                      <button
                        onClick={() => handlePurchaseClick("55")}
                        className="btn btn-primary"
                      >
                        Purchase
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handlePurchaseClick("99")}
                        className="btn btn-primary"
                      >
                        Purchase
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handlePurchaseClick("299")}
                        className="btn btn-primary"
                      >
                        Purchase
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        // onEntered={initializePaypal}
        centered
        dialogClassName="wordpress-payment-modal"
        contentClassName="wordpress-payment-content"
      >
        <Modal.Header closeButton className="wordpress-payment-header">
          <Modal.Title className="wordpress-payment-title">
            Complete Your Purchase
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="wordpress-payment-body">
          <p className="wordpress-payment-text">
            Please complete your payment of ${selectedCost} using PayPal:
          </p>

          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="email"
                value={myemail}
                placeholder="Enter Email ID"
                onChange={(e)=> setMyemail(e.target.value)}
                
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                value={myUrl}
                placeholder="Enter Website URL"
                onChange={(e)=> setMyUrl(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Button variant="primary" onClick={()=>handleBtnClick(myUrl,myemail)} className="wordpress-payment-cancel-btn">
            Submit
          </Button>
          </Form>



          <div
            id="paypal-button-container"
            className="wordpress-paypal-container mt-3"
          ></div>
        </Modal.Body>
        {/* <Modal.Footer className="wordpress-payment-footer">
          <Button variant="secondary" onClick={handleCloseModal} className="wordpress-payment-cancel-btn">
            Cancel
          </Button>
        </Modal.Footer> */}
      </Modal>
    </section>
  );
};

export default WordMaintainTable;
