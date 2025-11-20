"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProfileDisplay from "../components/profile/ProfileDisplay";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está logado
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeLink="perfil" />
      
      <Container className="py-4">
        <Row>
          <Col>
            {/* Título da página */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>

            {/* Tabs de navegação */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || 'perfil')}
              className="mb-4"
            >
              <Tab eventKey="perfil" title="Informações Pessoais">
                <ProfileDisplay showEditButton={true} />
              </Tab>
              
              <Tab eventKey="posts" title="Minhas Publicações">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-500 text-center">
                    Suas publicações aparecerão aqui em breve.
                  </p>
                </div>
              </Tab>
              
              <Tab eventKey="favoritos" title="Favoritos">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-500 text-center">
                    Seus pets favoritos aparecerão aqui em breve.
                  </p>
                </div>
              </Tab>
              
              <Tab eventKey="configuracoes" title="Configurações">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Configurações da Conta</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h4 className="font-medium">Notificações por Email</h4>
                        <p className="text-sm text-gray-500">Receber atualizações sobre adoções e eventos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h4 className="font-medium">Perfil Público</h4>
                        <p className="text-sm text-gray-500">Permitir que outros usuários vejam seu perfil</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Excluir Conta
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
