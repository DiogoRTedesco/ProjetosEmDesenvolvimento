import { Form } from 'react-bootstrap';

function Sobre({ isLoading, onSearch }) {


  return (
    <Form style={{margin: '2vh'}}>
      <Form.Text>
        <h3>Sobre o Overseer</h3>
        <h4>Versão: 1</h4>
        <h4>Copyright ©2023 Cia Industrial de Óleos do Nordeste - CIONE</h4>
        <h4><a href='https://www.cione.com.br/' rel="author noreferrer" target='_blank'>https://www.cione.com.br/</a></h4>
      </Form.Text>
    </Form>
  );
}
export default Sobre;