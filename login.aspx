<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesso ao Marketing - UNIP</title>
    <meta name="description" content="Acesse o ambiente do Marketing da UNIP utilizando seu login institucional. Área exclusiva para unidades.">
    <meta name="keywords" content="login unip, acesso marketing unip, marketing institucional unip">
    <meta name="title" content="Acesso ao Marketing - UNIP">
    <meta property="og:title" content="Acesso ao Marketing - UNIP">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.unip.br/marketing/login.aspx">
    <meta property="og:image" content="https://www.unip.br/marketing/assets/img/og-login.jpg">
    <meta property="og:image:secure_url" content="https://www.unip.br/marketing/assets/img/og-login.jpg">
    <meta property="og:image:alt" content="Login Marketing UNIP">
    <meta property="og:site_name" content="UNIP.br">
    <meta property="og:description" content="Acesse o ambiente restrito do departamento de Marketing da UNIP.">
    <meta name="twitter:site" content="@UNIPOficial">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Acesso ao Marketing - UNIP">
    <meta name="twitter:description" content="Login para acessar o ambiente de Marketing da UNIP.">
    <link rel="canonical" href="https://www.unip.br/marketing/login.aspx">
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/estilos.min.css" rel="stylesheet">

    <link rel="icon" type="image/png" href="/assets/img/favicon-32x32.png" />

    <style>
        body {
            background: #f5f7fb;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, Helvetica, sans-serif;
        }
    </style>
</head>

<body style="background-image: url('assets/img/bg-elements.svg'); background-size: cover; background-attachment: fixed;">
    <div class="container py-4 login-wrapper d-flex align-items-center">
        <div class="login-card w-100">
            <div class="row g-0">
                <!-- Imagem para DESKTOP -->
                <div class="col-lg-6 d-none d-lg-block">
                    <img src="assets/img/card-materiais-1.jpg" class="img-fluid w-100 h-100 object-fit-cover" alt="Material promocional (desktop)">
                </div>


                <div class="col-12 col-lg-6 bg-white">
                    <div class="p-4 p-sm-5">
                        <div class="d-flex justify-content-center mb-5">
                            <img src="/assets/img/logo/logo-unip-azul.svg" alt="UNIP" class="w-50">
                        </div>

                        <form class="needs-validation" novalidate method="post" action="/login">
                            <div class="form-floating mb-3">
                                <input type="text" title="Informe seu usu&aacute;rio" class="form-control" id="aluno__inpMatricula" name="aluno__inpMatricula" placeholder="Informe seu usu&aacute;rio" autocomplete="username" value="" onchange="verificarValidacao('matricula')" onblur="verificarValidacao('usuario')">
                                <label for="aluno__inpMatricula">Informe seu usu&aacute;rio</label>
                            </div>
                            <div class="form-floating">
                                <input type="password" title="Insira sua senha" class="form-control" id="xxx" name="xxx" placeholder="Digite a senha" autocomplete="current-password" onchange="verificarValidacao('senha')" onblur="verificarValidacao('senha')">
                                <label for="xxx">Senha</label>
                            </div>

                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="1" id="lembrar" name="lembrar">
                                    <label class="form-check-label small" for="lembrar">Lembrar de mim</label>
                                </div>
                                <a href="#" class="small text-decoration-none">Esqueci minha senha</a>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold">Entrar</button>
                        </form>

                        <div class="bg-warning small rounded-4 mt-4">
                            <div class="py-2 px-4">
                                <p class="pt-3"><strong>IMPORTANTE:</strong> Para acessar, utilize o mesmo login e senha do ambiente do processo seletivo de sua unidade.
                                    Caso tenha problemas de acesso, favor entrar em contato com nosso suporte (<a href="mailto:sistemas.suporte@unip.br">sistemas.suporte@unip.br</a>) pelo e-mail institucional.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/assets/js/jquery.min.js"></script>

    <script>
        (function () {
            'use strict';
            const forms = document.querySelectorAll('.needs-validation');
            Array.prototype.slice.call(forms).forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        })();
    </script>
</body>

</html>