import Markdown from 'react-markdown';
import remarkTypograph from '@calebduren/typograph/remark';

export function Message({ text }: { text: string }) {
  return <Markdown remarkPlugins={[remarkTypograph]}>{text}</Markdown>;
}
