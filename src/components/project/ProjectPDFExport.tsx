
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  checklistTitle: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  checklistItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 3,
  },
});

interface ProjectPDFProps {
  project: any;
  checklists: any[];
}

export function ProjectPDF({ project, checklists }: ProjectPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.text}>{project.description || "Sem descrição"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Detalhes do Projeto</Text>
          <Text style={styles.text}>Tipo: {project.type}</Text>
          <Text style={styles.text}>Tecnologias: {project.technologies?.join(", ") || "Não especificado"}</Text>
          <Text style={styles.text}>Prazo: {project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : "Não definido"}</Text>
          <Text style={styles.text}>Progresso: {project.progress}%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Checklists</Text>
          {checklists.map((checklist, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.checklistTitle}>{checklist.title}</Text>
              {checklist.checklist_items?.map((item: any, itemIndex: number) => (
                <Text key={itemIndex} style={styles.checklistItem}>
                  {item.checked ? "✓" : "○"} {item.description}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
