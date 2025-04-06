export const lexicalToHtml = (lexicalData) => {
    if (!lexicalData || !lexicalData.root || !lexicalData.root.children) {
      return '<p>No content available</p>';
    }
  
    const nodeToHtml = (node) => {
      if (!node || !node.type) return '';
  
      switch (node.type) {
        case 'paragraph':
          return `<p>${node.children.map(nodeToHtml).join('')}</p>`;
        case 'heading':
          return `<${node.tag}>${node.children.map(nodeToHtml).join('')}</${node.tag}>`;
        case 'text':
          let text = node.text || '';
          if (node.format === 1) text = `<strong>${text}</strong>`; // Bold
          if (node.format === 2) text = `<em>${text}</em>`; // Italic
          return text;
        case 'list':
          const listTag = node.listType === 'bullet' ? 'ul' : 'ol';
          return `<${listTag}>${node.children.map(nodeToHtml).join('')}</${listTag}>`;
        case 'listitem':
          return `<li>${node.children.map(nodeToHtml).join('')}</li>`;
        case 'quote':
          return `<blockquote>${node.children.map(nodeToHtml).join('')}</blockquote>`;
        case 'code':
          return `<pre><code>${node.children.map(nodeToHtml).join('')}</code></pre>`;
        default:
          return '';
      }
    };
  
    return lexicalData.root.children.map(nodeToHtml).join('');
  };
  