import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import Logo from '../../../src/images/OverseerLogo.png';
import Cione from '../../../src/images/cioneLogoPequena.png';


/*const styles = StyleSheet.create({
  page: {
    padding: 5,
    border: '5px solid black',
    display: 'flex'
  //dividir a páginas em quadrantes. 25% pra cada parte 
  },
  section: {
    marginBottom: 5,
    width: '100%'
  },
  sectionItem: {
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  heading: {
    fontSize: 24,
    marginBottom: 5,
    alignSelf: 'center'
  },
  subheading: {
    fontSize: 18,
    marginBottom: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    paddingLeft: 10,
    breakInside: 'avoid'
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 5,
    marginLeft: 5,
    marginTop: 5,

    border: '2px solid black',
    padding: 1

  },
  image2: {
    width: 120,
    height: 60,
    marginBottom: 5,
    marginLeft: '25%'

  },
  imageGrid: {
    display: 'flex',
    flexDirection: 'row'
  },
  border: {
    border: '1px solid black',
    height: '98%'
  },
  pageBreak: {
    '@media max-width: 400': {
      pageBreakAfter: 'always'
    },
    '@media min-width: 400': {
      pageBreakAfter: 'auto'
    }
  }
});*/

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 15
  },
  section: {
    marginBottom: 20
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
    alignSelf: 'center'
  },
  subheading: {
    fontSize: 18,
    marginBottom: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center'
  },
  tableCellHeader: {
    width: '25%',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5
  },
  tableCell: {
    width: '25%',
    fontSize: 12,
    padding: 5
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 5,
    marginLeft: 5,
    marginTop: 5,
    border: '2px solid black',
    padding: 1

  },
  image2: {
    width: 120,
    height: 60,
    marginBottom: 5,
    marginLeft: '30%',
    alignSelf: 'center'

  },
  imageGrid: {
    display: 'flex',
    flexDirection: 'row'
  },
 
});

export const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation={'landscape'}>
      <View style={styles.imageGrid}>
        <Image style={styles.image} src={Cione} />
        <Image style={styles.image2} src={Logo} />
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Relatório de Visitantes</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Status</Text>
            <Text style={styles.tableCellHeader}>Cpf</Text>
            <Text style={styles.tableCellHeader}>Visitante</Text>
            <Text style={styles.tableCellHeader}>Entrada</Text>
            <Text style={styles.tableCellHeader}>Saída</Text>
            <Text style={styles.tableCellHeader}>Visitado</Text>
            <Text style={styles.tableCellHeader}>Observação</Text>
          </View>
          {data.map((item) => (
            <View key={item.id} style={styles.tableRow}>

              <Text style={styles.tableCell}>{item.status}</Text>
              <Text style={styles.tableCell}>{item.cpf}</Text>
              <Text style={styles.tableCell}>{item.nome}</Text>
              <Text style={styles.tableCell}>{item.entrada}</Text>
              <Text style={styles.tableCell}>{item.saida}</Text>
              <Text style={styles.tableCell}>{item.pessoaVisitada}</Text>
              <Text style={styles.tableCell}>{item.observacao}</Text>
            </View>

          ))}
        </View>
      </View>
    </Page>
  </Document >
);

