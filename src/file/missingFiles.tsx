import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

import { render } from '@react-email/render';

interface MissingFilesAlertProps {
  missingFiles: string[];
}

export const MissingFilesAlert = ({
  missingFiles = ['example1.txt', 'example2.jpg'],
}: MissingFilesAlertProps) => (
  <Html>
    <Head />
    <Preview>URGENT: Missing Files in File System</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>⚠️ File System Alert: Missing Files</Heading>
        <Text style={text}>
          We have detected that the following files are missing from the File
          System:
        </Text>
        <Section style={list}>
          <ul>
            {missingFiles.map((file, index) => (
              <li key={index} style={listItem}>
                {file}
              </li>
            ))}
          </ul>
        </Section>
        <Hr style={hr} />
        <Text style={urgentText}>
          This situation requires immediate attention. Please resolve this issue
          as soon as possible to prevent any potential data loss or system
          disruptions.
        </Text>
        <Text style={text}>
          If you need assistance, please contact the IT support team
          immediately.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This is an automated alert from your File System Monitoring Service.{' '}
          <Link href="https://example.com/file-system-status" style={link}>
            Check System Status
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const h1 = {
  color: '#e53e3e',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const list = {
  backgroundColor: '#f8f8f8',
  borderRadius: '4px',
  padding: '20px',
  margin: '20px 0',
};

const listItem = {
  margin: '10px 0',
};

const urgentText = {
  color: '#e53e3e',
  fontSize: '18px',
  fontWeight: 'bold',
  lineHeight: '26px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

export default function renderMissingFilesEmail(files: string[]) {
  return render(<MissingFilesAlert missingFiles={files} />);
}
