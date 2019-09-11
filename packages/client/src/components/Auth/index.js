import React from "react";
import { Redirect } from "react-router";
import { Row, Col, Form, Icon, Input, Button, Checkbox } from "antd";
import _ from "lodash";

const Auth = ({ match, location }) => {
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo") || "/";
  localStorage.setItem("redirectTo", redirectTo);

  const isAuthenticated = () => {
    // get the access token
    const accessToken = localStorage.getItem("accessToken");
    return !_.isNil(accessToken);
  };

  if (isAuthenticated()) {
    return <Redirect to="/" />;
  }

  return (
    <Row>
      <Col span={8} />
      <Col span={8}>
        <form
          method="get"
          action={`${process.env.REACT_APP_API_SERVER}/auth/guest`}
          className="login-form"
        >
          <Form.Item>
            <Input
              name="email"
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="email"
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </form>
      </Col>
      <Col span={8} />
    </Row>
  );
};

export default Auth;
