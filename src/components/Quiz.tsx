import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, RotateCcw, Home, PlayCircle, Clock, Award } from 'lucide-react';
import { Section } from '../App';
import violaoGreen from './midias_obrigatorias/violao_green.ogg';
import violaoRed from './midias_obrigatorias/violao_red.ogg';
import stopMotion from './midias_obrigatorias/stopmotion.mp4';


interface QuizProps {
  onNavigate: (section: Section) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const allQuestions: Question[] = [
  {
    id: 1,
    question: 'O que é áudio digital?',
    options: [
      'Som convertido em números para ser processado por dispositivos',
      'Som tocado apenas em vinil',
      'Som que só funciona com internet',
      'Um tipo de vídeo'
    ],
    correctAnswer: 0,
    explanation: 'Áudio digital é o som convertido em valores numéricos para armazenamento e reprodução.',
  },
  {
    id: 2,
    question: 'Qual destes é um formato de áudio?',
    options: ['JPG', 'MP3', 'DOC', 'PNG'],
    correctAnswer: 1,
    explanation: 'MP3 é um formato de áudio amplamente utilizado.',
  },
  {
    id: 3,
    question: 'Qual dispositivo é usado para gravar áudio?',
    options: ['Monitor', 'Mouse', 'Microfone', 'Teclado'],
    correctAnswer: 2,
    explanation: 'O microfone captura ondas sonoras.',
  },
  {
    id: 4,
    question: 'O que significa aumentar o volume?',
    options: ['Aumentar a velocidade', 'Aumentar a força/intensidade do som', 'Aumentar o grave', 'Aumentar o agudo'],
    correctAnswer: 1,
    explanation: 'Volume está relacionado à intensidade do som.',
  },
  {
    id: 5,
    question: 'Qual destes é um formato de áudio comprimido?',
    options: ['WAV', 'FLAC', 'MP3', 'AIFF'],
    correctAnswer: 2,
    explanation: 'MP3 é um formato comprimido com perda.',
  },
  {
    id: 6,
    question: 'Para ouvir música, qual equipamento é mais usado?',
    options: ['Webcam', 'Caixa de som', 'Scanner', 'Projetor'],
    correctAnswer: 1,
    explanation: 'Caixas de som emitem áudio.',
  },
  {
    id: 7,
    question: 'O que é um fone de ouvido?',
    options: [
      'Um dispositivo para ouvir som de forma individual',
      'Um microfone',
      'Um alto-falante gigante',
      'Uma caixa de armazenamento'
    ],
    correctAnswer: 0,
    explanation: 'Fones permitem ouvir áudio de forma privada.',
  },
  {
    id: 8,
    question: 'O que é uma trilha sonora?',
    options: [
      'Um tipo de microfone',
      'Um cabo de energia',
      'O conjunto de músicas de um filme ou jogo',
      'Um efeito visual'
    ],
    correctAnswer: 2,
    explanation: 'Trilhas sonoras são músicas criadas para acompanhar mídias.',
  },
  {
    id: 9,
    question: 'Qual desses arquivos normalmente tem melhor qualidade?',
    options: ['MP3 128 kbps', 'MP3 320 kbps', 'MP3 64 kbps', 'MP3 40 kbps'],
    correctAnswer: 1,
    explanation: 'Quanto maior o bitrate, melhor a qualidade do áudio.',
  },
  {
    id: 10,
    question: 'O que significa "stéreo"?',
    options: [
      'Áudio transmitido por uma caixa apenas',
      'Áudio com dois canais (esquerdo e direito)',
      'Áudio sem som',
      'Áudio de baixa qualidade'
    ],
    correctAnswer: 1,
    explanation: 'Áudio estéreo utiliza dois canais para criar sensação de espaço.',
  },
  {
    id: 11,
    question: 'Qual destes é um software para editar áudio?',
    options: ['Audacity', 'Paint', 'Excel', 'Chrome'],
    correctAnswer: 0,
    explanation: 'O Audacity é um editor de áudio gratuito.',
  },
  {
    id: 12,
    question: 'O que é “play” em um player?',
    options: ['Pausar', 'Reproduzir o áudio', 'Gravar', 'Apagar o som'],
    correctAnswer: 1,
    explanation: 'Play significa iniciar a reprodução do som.',
  },
  {
    id: 13,
    question: 'Qual é a unidade usada para medir volume?',
    options: ['Segundos', 'Watts', 'Decibéis (dB)', 'Pixels'],
    correctAnswer: 2,
    explanation: 'Decibéis medem a intensidade sonora.',
  },
  {
    id: 14,
    question: 'O que significa “mute” em um vídeo ou player de áudio?',
    options: ['Aumentar o som', 'Diminuir o brilho', 'Silenciar o áudio', 'Repetir o vídeo'],
    correctAnswer: 2,
    explanation: 'Mute desliga o som.',
  },
  {
    id: 15,
    question: 'Qual mídia é frequentemente usada para armazenar músicas?',
    options: ['Pen drive', 'Caderno', 'Calculadora', 'Régua'],
    correctAnswer: 0,
    explanation: 'Pen drives são dispositivos comuns de armazenamento de áudio.',
  }
];

export function Quiz({ onNavigate }: QuizProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Refs para áudio
  const greenSound = useRef<HTMLAudioElement | null>(null);
  const redSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    greenSound.current = new Audio(violaoGreen);
    redSound.current = new Audio(violaoRed);
  }, []);

  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setUserAnswers(new Array(shuffled.length).fill(null));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setQuizStarted(false);
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (index: number) => {
    if (userAnswers[currentQuestionIndex] !== null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = index;
    setUserAnswers(newAnswers);

    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;

    // toca o áudio
    if (isCorrect) greenSound.current?.play();
    else redSound.current?.play();
  };

  const handleNextQuestion = () => {
    const answer = userAnswers[currentQuestionIndex];
    if (answer === null) return;

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setUserAnswers(new Array(shuffled.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setScore(0);
    setQuizStarted(false);
  };

  const getFeedbackMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return { text: 'Excelente! Você domina o assunto!', color: 'text-green-600' };
    if (percentage >= 80) return { text: 'Muito bom! Você tem um ótimo conhecimento!', color: 'text-blue-600' };
    if (percentage >= 60) return { text: 'Bom trabalho! Continue estudando!', color: 'text-yellow-600' };
    return { text: 'Precisa revisar o conteúdo. Não desista!', color: 'text-orange-600' };
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-gray-600">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mb-6">
              <Award className="w-10 h-10 text-pink-600" />
            </div>
            <h1 className="text-gray-900 mb-4">Quiz – Teste seus conhecimentos</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Responda às perguntas sobre áudio digital e descubra o quanto você aprendeu.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 bg-pink-600 text-white px-10 py-4 rounded-lg hover:bg-pink-700"
            >
              <PlayCircle className="w-6 h-6" />
              Iniciar Quiz
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-gray-200 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-300"
            >
              Voltar à Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const feedback = getFeedbackMessage(score, questions.length);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <h1 className="text-gray-900 mb-8">Resultado do Quiz</h1>

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 mb-6">
              <span className="text-blue-900" style={{ fontSize: '3rem' }}>
                {score}/{questions.length}
              </span>
            </div>

            <p className={`${feedback.color} mb-4`}>{feedback.text}</p>
          </div>

          {/* VÍDEO SE ACERTAR 3 OU MAIS */}
          {score >= 3 && (
            <video
              src={stopMotion}
               autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-2xl mx-auto mb-10 rounded-xl shadow-lg"
            />
          )}

          <div className="flex gap-4 justify-center">
            <button onClick={handleRestart} className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700">
              Fazer novamente
            </button>

            <button onClick={() => onNavigate('home')} className="bg-gray-200 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-300">
              Voltar à Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selected = userAnswers[currentQuestionIndex];
  const hasAnswered = selected !== null;
  const isCorrect = hasAnswered && selected === currentQuestion.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-gray-900">Quiz – Teste seus conhecimentos</h1>
          <span className="text-gray-600">Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
        </div>

        <h2 className="text-gray-900 mb-6">{currentQuestion.question}</h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => {
            let style = "w-full text-left p-4 rounded-lg border-2 transition-all ";

            if (hasAnswered) {
              if (index === currentQuestion.correctAnswer) {
                style += "border-green-500 bg-green-50";
              } else if (index === selected) {
                style += "border-red-500 bg-red-50";
              } else {
                style += "border-gray-200 bg-gray-50";
              }
            } else {
              style += selected === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={hasAnswered}
                className={style}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>

                  {hasAnswered && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}

                  {hasAnswered && index === selected && index !== currentQuestion.correctAnswer && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className={`mb-6 p-4 rounded-lg ${isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-blue-50 border-l-4 border-blue-500"}`}>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-700">Pontos: {score}</span>

          <button
            onClick={handleNextQuestion}
            disabled={!hasAnswered}
            className={`px-8 py-3 rounded-lg transition-colors
              ${!hasAnswered ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {currentQuestionIndex < questions.length - 1 ? "Próxima pergunta" : "Ver resultado"}
          </button>
        </div>
      </div>
    </div>
  );
}