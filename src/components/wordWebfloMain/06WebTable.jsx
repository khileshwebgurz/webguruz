import React from "react";

const WebTable = () => {
  return (
    <section className="wordpress-maintenance-package py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-0 mx-auto col-12 heading-main text-center mb-4 mb-5">
            <h2 className="mb-2">
              Our <span>Webflow Maintenance Plans</span>
            </h2>
            <p>
              At WebGuruz Technologies, we offer flexible maintenance plans to
              suit businesses of all sizes. From basic support for small
              websites to comprehensive maintenance for complex Webflow builds,
              we have a solution for you. Our plans include regular updates,
              security checks, performance optimizations, and dedicated support
              to keep your website running smoothly.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-bordered  text-center">
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
                      <button className="btn btn-primary">Purchase</button>
                    </td>
                    <td>
                      <button className="btn btn-primary">Purchase</button>
                    </td>
                    <td>
                      <button className="btn btn-primary">Purchase</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebTable;
