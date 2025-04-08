import React, { useState, useRef, useEffect } from 'react';
import { Save, FileText, Download, HelpCircle, File } from 'lucide-react';

interface FileState {
  name: string | null;
  content: string;
  isModified: boolean;
}

function App() {
  const [file, setFile] = useState<FileState>({
    name: null,
    content: '',
    isModified: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            handleNew();
            break;
          case 'o':
            e.preventDefault();
            fileInputRef.current?.click();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [file]);

  const handleNew = () => {
    if (file.isModified) {
      if (window.confirm('¿Desea guardar los cambios antes de crear un nuevo archivo?')) {
        handleSave();
      }
    }
    setFile({ name: null, content: '', isModified: false });
  };

  const handleOpen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (!fileObj) return;

    if (file.isModified) {
      if (!window.confirm('¿Desea guardar los cambios antes de abrir otro archivo?')) {
        return;
      }
      handleSave();
    }

    const text = await fileObj.text();
    setFile({
      name: fileObj.name,
      content: text,
      isModified: false
    });
    e.target.value = '';
  };

  const handleSave = () => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'nuevo-archivo.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFile(prev => ({ ...prev, isModified: false }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFile(prev => ({
      ...prev,
      content: e.target.value,
      isModified: true
    }));
  };

  const handleHelp = () => {
    alert(`Atajos de teclado:
- Ctrl + N: Nuevo archivo
- Ctrl + O: Abrir archivo
- Ctrl + S: Guardar archivo`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Barra de título */}
          <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Editor de Texto
              {file.name && ` - ${file.name}`}
              {file.isModified && ' *'}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleNew}
                className="text-white hover:text-indigo-200 transition-colors flex items-center gap-1"
                title="Nuevo (Ctrl+N)"
              >
                <File className="h-5 w-5" />
                Nuevo
              </button>
              <label className="text-white hover:text-indigo-200 transition-colors flex items-center gap-1 cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleOpen}
                  className="hidden"
                />
                <Download className="h-5 w-5" />
                Abrir
              </label>
              <button
                onClick={handleSave}
                className="text-white hover:text-indigo-200 transition-colors flex items-center gap-1"
                title="Guardar (Ctrl+S)"
              >
                <Save className="h-5 w-5" />
                Guardar
              </button>
              <button
                onClick={handleHelp}
                className="text-white hover:text-indigo-200 transition-colors"
                title="Ayuda"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Área de texto */}
          <div className="p-6">
            <textarea
              value={file.content}
              onChange={handleContentChange}
              className="w-full h-[calc(100vh-16rem)] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono"
              placeholder="Escribe o pega tu texto aquí..."
              spellCheck="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;