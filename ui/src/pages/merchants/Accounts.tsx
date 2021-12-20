import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { Alert } from "../../components/Alert";

export const Accounts = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAccounts = async () => {
    try {
      const data = await API.get("cassavaPay", "/merchants/accounts", {
        body: {},
      });
      setAccounts(data.data);
      setIsLoading(false);
    } catch (error) {
      const err = error as any;
      Alert(err.message, "error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Merchant ID</th>
            <th>Api key</th>
            <th>Label</th>
            <th>Wallet</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td className="text-center" colSpan={5}>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Loading Accounts...
              </td>
            </tr>
          )}
          {!isLoading && accounts && accounts.length === 0 && (
            <tr>
              <td className="text-center" colSpan={5}>
                No Merchant account yet!
              </td>
            </tr>
          )}

          {!isLoading &&
            accounts &&
            accounts.length > 0 &&
            accounts.map((account, index) => (
              <tr key={index}>
                <td className="no-wrap">{account.merchant_id}</td>
                <td className="no-wrap">{account.api_key}</td>
                <td className="no-wrap">{account.label}</td>
                <td className="no-wrap">{account.cold_wallet_address}</td>
                <td className="no-wrap">{account.enabled.toString()}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};
