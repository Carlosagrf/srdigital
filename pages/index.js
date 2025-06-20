import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Form.module.css';
import 'keen-slider/keen-slider.min.css';
import InputMask from 'react-input-mask';

import logo from '../public/sr-logo-dark.svg';

import { useKeenSlider } from 'keen-slider/react';

const estados = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'TO', nome: 'Tocantins' },
];

const produtos = [
  // {
  //   nome: 'Sabonete Líquido',
  //   valor: 'sabonete',
  //   imagem: '/Sabonete_Liquido.png',
  // },
  // {
  //   nome: 'Hidratante',
  //   valor: 'hidratante',
  //   imagem: '/Hidratante.png',
  // },
  // {
  //   nome: 'Kit Shampo e Condicionador',
  //   valor: 'kit',
  //   imagem: '/Kit_Shampo_Condicionador.png',
  // }
];

export default function Home() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    instagram: '',
    whatsapp: '',
    tiktok: '',
    youtube: '',
    motivo: '',
    termos: false,
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    estado: '',
    cidade: '',
    bairro: '',
  });
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');
  const [modalProduto, setModalProduto] = useState(null);
  const [modalTermos, setModalTermos] = useState(false);
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [erroCidades, setErroCidades] = useState('');
  const [cepBuscando, setCepBuscando] = useState(false);
  const [cepErro, setCepErro] = useState('');
  const [cidadeViaCep, setCidadeViaCep] = useState('');
  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(max-width: 700px)': {
        slides: { perView: 1, spacing: 8 },
      },
    },
    loop: true,
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!form.estado) {
      setCidades([]);
      setErroCidades('');
      setForm((prev) => ({ ...prev, cidade: '' }));
      return;
    }
    setLoadingCidades(true);
    setErroCidades('');
    setCidades([]);
    setForm((prev) => ({ ...prev, cidade: '' }));
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.estado}/municipios`)
      .then((res) => res.json())
      .then((data) => {
        setCidades(data.map((c) => c.nome));
        setLoadingCidades(false);
      })
      .catch(() => {
        setErroCidades('Erro ao carregar cidades.');
        setLoadingCidades(false);
      });
  }, [form.estado]);

  useEffect(() => {
    if (form.cep && form.cep.replace(/\D/g, '').length === 8) {
      setCepBuscando(true);
      setCepErro('');
      fetch(`https://viacep.com.br/ws/${form.cep.replace(/\D/g, '')}/json/`)
        .then(res => res.json())
        .then(data => {
          if (data.erro) {
            setCepErro('CEP não encontrado.');
            setCepBuscando(false);
            return;
          }
          setForm(prev => ({
            ...prev,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            estado: data.uf || '',
          }));
          setCidadeViaCep(data.localidade || '');
          setCepBuscando(false);
        })
        .catch(() => {
          setCepErro('Erro ao buscar CEP.');
          setCepBuscando(false);
        });
    }
  }, [form.cep]);

  useEffect(() => {
    if (cidadeViaCep && cidades.length > 0) {
      const cidadeEncontrada = cidades.find(c => c.toLowerCase() === cidadeViaCep.toLowerCase());
      if (cidadeEncontrada) {
        setForm(prev => ({ ...prev, cidade: cidadeEncontrada }));
        setCidadeViaCep('');
      }
    }
  }, [cidades, cidadeViaCep]);

  useEffect(() => {
    if (!modalProduto) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setModalProduto(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalProduto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProduto = (valor) => {
    setForm((prev) => ({ ...prev, produto: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (!form.cep || !form.rua || !form.numero || !form.bairro || !form.cidade || !form.estado) {
      setErro('Preencha todos os campos obrigatórios do endereço.');
      return;
    }
    setModalTermos(true);
  };

  const handleConfirmarParticipacao = async () => {
    setLoadingSubmit(true);
    
    try {
      const res = await fetch('/api/inscricao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setEnviado(true);
      else {
        const err = await res.json();
        setErro('Erro ao enviar: ' + (err.error || 'Tente novamente.'));
        console.error('Erro ao enviar:', err);
      }
    } catch (e) {
      setErro('Erro ao enviar. Tente novamente.');
      console.error('Erro ao enviar:', e);
    }
    setLoadingSubmit(false);
    setModalTermos(false);
  };

  if (enviado) {
    return (
      <div className={styles.container}>
        <div className={styles.sucesso}>
          <h2>Inscrição enviada com sucesso!</h2>
          <p>Obrigado por se inscrever!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {modalProduto && (
        <div className={styles.modalOverlay} onClick={() => setModalProduto(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalImageBox}>
              <Image src={modalProduto.imagem} alt={modalProduto.nome} fill style={{objectFit: 'contain'}} />
            </div>
            <div className={styles.modalProductName}>{modalProduto.nome}</div>
            <button className={styles.modalClose} onClick={() => setModalProduto(null)}>&times;</button>
          </div>
        </div>
      )}

      {modalTermos && (
        <div className={styles.modalOverlay} onClick={() => setModalTermos(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Regras de Participação</h3>
            <div className={styles.termosContent}>
              <p>Cadastro e Seleção:</p>
              <ul>
                <li>Após preencher o cadastro, você será adicionado a uma lista de influenciadores.</li>
                <li>Somente os influenciadores selecionados receberão um e-mail com o link de afiliado e estarão elegíveis ao comissionamento.</li>
              </ul>

              <p>Recebimento do Produto:</p>
              <ul>
                <li>Caso futuras campanhas envolvam produtos, o produto escolhido será enviado como cortesia para a criação de conteúdo e/ou review do produto.</li>
                <li>É essencial fornecer o endereço corretamente no cadastro.</li>
              </ul>

              <p>Postagens e Código de Afiliado:</p>
              <ul>
                <li>Para realizar as postagens, sempre utilize o código de afiliado que será enviado em futuras fases.</li>
              </ul>

              <p>Comunicações da Campanha:</p>
              <ul>
                <li>Ao realizar este cadastro, você autoriza a Upfluence a enviar e-mails com as demais comunicações relacionadas à campanha.</li>
                <li>Escolha o melhor e-mail para o cadastro, pois todas as comunicações sobre a campanha serão enviadas para o e-mail informado.</li>
              </ul>

              <p style={{ color: '#e11d48', fontWeight: '600', marginTop: '20px' }}>Importante:</p>
              <p style={{ color: '#e11d48', marginTop: '8px' }}>O preenchimento deste formulário não garante a participação em campanha nem o envio do produto gratuitamente.</p>
            </div>
            <button 
              className={styles.btnConfirmar} 
              onClick={handleConfirmarParticipacao}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
                  <span className={styles.spinner} />
                  Enviando...
                </span>
              ) : (
                'Confirmar Participação'
              )}
            </button>
            <button className={styles.modalClose} onClick={() => setModalTermos(false)}>&times;</button>
          </div>
        </div>
      )}

      <div className={styles.formBox}>
        <div className={styles.headerCardSRDigi}>
          <div>
            <Image src={logo} alt="Logo SR Digi" width={70} className={styles.logoSRDigi} />
            <h1>Cadastro de Influenciadores</h1>
            <p>Seja visto por marcas que estão procurando creators como você!</p>
          </div>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <input name="nome" className={`${styles.fieldName}`} placeholder="Nome completo" value={form.nome} onChange={handleChange} required />
          <input name="email" className={`${styles.fieldEmail}`} type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
          <input name="instagram" className={`${styles.fieldInstagram}`} placeholder="Instagram @seuusuario" value={form.instagram} onChange={handleChange} required />
          <input name="tiktok" className={`${styles.fieldTiktok}`} placeholder="TikTok @seuusuario" value={form.tiktok} onChange={handleChange} />
          <input name="whatsapp" className={`${styles.fieldWhatsapp}`} placeholder="WhatsApp" value={form.whatsapp} onChange={handleChange} />
          
          <InputMask
            mask="99999-999"
            name="cep"
            value={form.cep}
            onChange={handleChange}
            required
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className={styles.fieldCep}
                placeholder="CEP"
              />
            )}
          </InputMask>

          {cepBuscando && <span style={{color: '#7c3aed', fontSize: '0.95em'}}>Buscando endereço...</span>}
          {cepErro && <span style={{color: '#e11d48', fontSize: '0.95em'}}>{cepErro}</span>}
          <input name="rua" className={`${styles.fieldCep2}`} placeholder="Rua" value={form.rua} onChange={handleChange} required />
          <input name="numero" className={`${styles.fieldCep2}`} placeholder="Número" value={form.numero} onChange={handleChange} required />
          <input name="complemento" className={`${styles.fieldCep2}`} placeholder="Complemento (opcional)" value={form.complemento} onChange={handleChange} />
          <input name="bairro" className={`${styles.fieldCep2}`} placeholder="Bairro" value={form.bairro} onChange={handleChange} required />
          <select name="cidade" value={form.cidade} onChange={handleChange} required disabled={!form.estado || loadingCidades} className={styles.select}>
            <option value="">{loadingCidades ? 'Carregando cidades...' : 'Selecione a cidade'}</option>
            {erroCidades && <option disabled>{erroCidades}</option>}
            {cidades.map((cidade) => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>
          <select name="estado" value={form.estado} onChange={handleChange} required className={styles.select}>
            <option value="">Selecione o estado</option>
            {estados.map((uf) => (
              <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
            ))}
          </select>
          {erro && <div className={styles.erro}>{erro}</div>}
          <button type="submit" className={styles.btn} disabled={loadingSubmit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loadingSubmit ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
                <span className={styles.spinner} />
                Enviando...
              </span>
            ) : (
              <span style={{ width: '100%', textAlign: 'center' }}>Enviar!</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 