
import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Désolé, la page que vous avez visitée n'existe pas."
        extra={
          <Link to="/">
            <Button type="primary">
              Retour à l'Accueil
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
