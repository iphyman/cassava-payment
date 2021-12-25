import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import { Alert } from "../../components/Alert";

export const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTransactions = async () => {
    try {
      const data = await API.get("cassavaPay", "/merchants/transactions", {});
      setTransactions(data.data);
      setIsLoading(false);
    } catch (error) {
      const err = error as any;
      Alert(err.message, "error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Type</th>
          <th>From wallet</th>
          <th>To Wallet</th>
          <th>Transaction hash</th>
          <th>Created at</th>
          <th>View transaction</th>
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td className="text-center" colSpan={7}>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Loading Transactions...
            </td>
          </tr>
        )}
        {!isLoading && transactions && transactions.length === 0 && (
          <tr>
            <td className="text-center" colSpan={7}>
              No Transaction yet!
            </td>
          </tr>
        )}
        {!isLoading &&
          transactions &&
          transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <tr key={index}>
              <td className="no-wrap">{transaction.amount}</td>
              <td className="no-wrap">{transaction.type}</td>
              <td className="no-wrap">{transaction.from_wallet}</td>
              <td className="no-wrap">{transaction.to_wallet}</td>
              <td className="no-wrap">{transaction.transaction_hash}</td>
              <td className="no-wrap">{transaction.created_at}</td>
              <td className="no-wrap">
                <Button
                  variant="primary"
                  as="a"
                  href={`https://testnet.reefscan.com/${transaction.to_wallet}`}
                  target="_blank"
                >
                  Reef Scan
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};
