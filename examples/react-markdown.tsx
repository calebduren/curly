import Markdown from 'react-markdown';
import remarkCurly from 'cowboy-curly/remark';

export function Message({ text }: { text: string }) {
  return <Markdown remarkPlugins={[remarkCurly]}>{text}</Markdown>;
}
