import { Radio, Waves, Minimize2, FileAudio, Lightbulb, HelpCircle, Play } from 'lucide-react';
import { Section } from '../App';
import { useRef, useEffect } from 'react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

interface HomeProps {
  onNavigate: (section: Section) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const playerRef = useRef<MidiPlayer.Player | null>(null);
  const instrumentRef = useRef<any>(null);

  useEffect(() => {
    // Inicializar o player MIDI
    playerRef.current = new MidiPlayer.Player();
    
    // Carregar o soundfont (piano acústico)
    Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then((instrument) => {
      instrumentRef.current = instrument;
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const handlePlayAudio = async () => {
    try {
      if (!playerRef.current || !instrumentRef.current) {
        console.error('Player ou instrumento não inicializado');
        return;
      }

      // Buscar o arquivo MIDI
      const response = await fetch('/src/components/midias_obrigatorias/aula.mid');
      const arrayBuffer = await response.arrayBuffer();
      
      // Carregar o arquivo no player
      playerRef.current.loadArrayBuffer(arrayBuffer);
      
      // Configurar o callback para tocar as notas
      playerRef.current.on('midiEvent', (event: any) => {
        if (event.name === 'Note on' && event.velocity > 0) {
          instrumentRef.current.play(event.noteName, 0, { gain: event.velocity / 100 });
        }
      });

      // Iniciar a reprodução
      playerRef.current.play();
    } catch (error) {
      console.error('Erro ao reproduzir áudio MIDI:', error);
    }
  };

  const modules = [
    {
      id: 'o-que-e' as Section,
      icon: Radio,
      title: 'O que é áudio digital',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      id: 'amostragem' as Section,
      icon: Waves,
      title: 'Amostragem e quantização',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      id: 'compressao' as Section,
      icon: Minimize2,
      title: 'Compressão de áudio',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      id: 'formatos' as Section,
      icon: FileAudio,
      title: 'Formatos e padrões',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600',
    },
    {
      id: 'quiz' as Section,
      icon: HelpCircle,
      title: 'Quiz Interativo',
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-gray-900 mb-4">
          Áudio Digital – Conceitos Interativos
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore os fundamentos do áudio digital de forma interativa e visual. 
          Aprenda sobre amostragem, compressão, formatos e muito mais através de exemplos práticos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => onNavigate(module.id)}
              className={`${module.color} border-2 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-left`}
            >
              <Icon className={`${module.iconColor} w-12 h-12 mb-4`} />
              <h3 className="text-gray-900">
                {module.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Botão tipo player */}
      <div className="flex justify-center mt-10">
        <button
          className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full px-6 py-3 shadow transition-all duration-300 transform hover:scale-105"
          onClick={handlePlayAudio}
        >
          <Play className="w-6 h-6 text-gray-700" />
          <span className="text-gray-700 font-medium">Teste seu fone</span>
        </button>
      </div>
    </div>
  );
}
